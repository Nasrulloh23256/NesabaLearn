<?php

namespace App\Http\Controllers;

use App\Models\ChatbotConversation;
use App\Models\ChatbotMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class ChatbotController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $conversations = $this->listConversations($user->id);
        $activeConversationId = $conversations[0]['id'] ?? null;
        $messages = $activeConversationId
            ? $this->listMessages($activeConversationId, $user->id)
            : [];

        return Inertia::render('User/Meetings/Chatbot', [
            'conversations' => $conversations,
            'activeConversationId' => $activeConversationId,
            'messages' => $messages,
        ]);
    }

    public function ask(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'conversation_id' => ['nullable', 'integer'],
        ]);

        $message = trim($data['message']);
        $user = $request->user();
        $conversation = $this->findConversation($data['conversation_id'] ?? null, $user->id);

        if (!$conversation) {
            $conversation = ChatbotConversation::create([
                'user_id' => $user->id,
                'title' => 'Percakapan Baru',
            ]);
        }

        $userMessage = ChatbotMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'user',
            'message' => $message,
        ]);

        $reply = $this->buildReply($message);

        $assistantMessage = ChatbotMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'message' => $reply,
        ]);

        if (!$conversation->title || $conversation->title === 'Percakapan Baru') {
            $conversation->title = $this->generateTitle($message);
            $conversation->save();
        } else {
            $conversation->touch();
        }

        return response()->json([
            'reply' => $reply,
            'conversation' => $this->mapConversation($conversation),
            'messages' => [
                $this->mapMessage($userMessage),
                $this->mapMessage($assistantMessage),
            ],
        ]);
    }

    public function show(ChatbotConversation $conversation, Request $request): JsonResponse
    {
        $this->assertOwner($conversation, $request->user()->id);

        return response()->json([
            'conversation' => $this->mapConversation($conversation),
            'messages' => $this->listMessages($conversation->id, $request->user()->id),
        ]);
    }

    public function create(Request $request): JsonResponse
    {
        $conversation = ChatbotConversation::create([
            'user_id' => $request->user()->id,
            'title' => 'Percakapan Baru',
        ]);

        return response()->json([
            'conversation' => $this->mapConversation($conversation),
            'messages' => [],
        ]);
    }

    public function rename(ChatbotConversation $conversation, Request $request): JsonResponse
    {
        $this->assertOwner($conversation, $request->user()->id);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:80'],
        ]);

        $conversation->update(['title' => $data['title']]);

        return response()->json([
            'conversation' => $this->mapConversation($conversation),
        ]);
    }

    public function destroy(ChatbotConversation $conversation, Request $request): JsonResponse
    {
        $this->assertOwner($conversation, $request->user()->id);

        $conversation->delete();

        return response()->json([
            'deleted' => true,
        ]);
    }

    private function buildReply(string $message): string
    {
        $lower = strtolower($message);
        $normalized = preg_replace('/[^a-z0-9\\s]/', ' ', $lower) ?? $lower;

        $greetings = [
            'hai', 'halo', 'hello', 'hi', 'hey',
            'salam', 'perkenalkan', 'saya', 'nama saya',
        ];

        if ($this->containsAny($normalized, $greetings)) {
            return "Saya adalah chatbot AI dari NesabaLearn. Tugas saya adalah menjawab pertanyaan Anda seputar dunia artikel ilmiah, jurnal, dan OJS. Silakan ajukan pertanyaan seperti: cara submit artikel di OJS, struktur artikel ilmiah, atau tips lolos peer-review.";
        }

        $topics = [
            'artikel',
            'article',
            'jurnal',
            'journal',
            'ojs',
            'open journal systems',
            'manuscript',
            'publikasi',
            'submission',
            'submit',
            'review',
            'peer',
            'editorial',
            'doi',
            'issn',
            'sitasi',
            'citation',
            'referensi',
            'daftar pustaka',
            'plagiar',
            'turnitin',
            'template',
            'abstrak',
            'abstract',
            'metode',
            'metodologi',
            'hasil',
            'pembahasan',
        ];

        if (!$this->containsAny($normalized, $topics)) {
            return "Maaf, chatbot ini hanya menjawab seputar artikel ilmiah, jurnal, dan OJS. Coba tanyakan hal seperti: struktur artikel ilmiah, cara submit di OJS, proses review, template jurnal, atau etika sitasi.";
        }

        $geminiReply = $this->askGemini($message);
        if ($geminiReply) {
            return $geminiReply;
        }

        $intents = [
            [
                'keywords' => ['cara menulis', 'menulis', 'writing', 'tips menulis', 'how to write'],
                'answer' => "Berikut langkah menulis artikel ilmiah secara terstruktur:\n\n1) Tentukan topik & jurnal tujuan: pilih topik yang spesifik dan pastikan sesuai scope jurnal.\n2) Kumpulkan referensi primer: fokus pada artikel terbaru dan relevan.\n3) Susun outline IMRaD: Pendahuluan, Metode, Hasil, Pembahasan, Kesimpulan.\n4) Tulis pendahuluan yang kuat: latar belakang, gap riset, tujuan.\n5) Jelaskan metode secara rinci agar dapat direplikasi.\n6) Sajikan hasil dengan tabel/grafik yang jelas.\n7) Bahas temuan dengan mengaitkan literatur.\n8) Rapikan sitasi & daftar pustaka sesuai template jurnal.\n9) Cek plagiarisme dan bahasa.\n10) Siapkan metadata & submit lewat OJS.\n\nJika Anda mau, sebutkan bidang/topik agar saya bisa memberi saran lebih spesifik.",
            ],
            [
                'keywords' => ['ojs', 'open journal systems'],
                'answer' => "OJS (Open Journal Systems) adalah platform pengelolaan jurnal. Alur umumnya:\n1) Registrasi penulis → 2) New Submission → 3) Checklist & persyaratan → 4) Upload naskah → 5) Isi metadata (judul, abstrak, kata kunci, penulis) → 6) Konfirmasi → 7) Review → 8) Revisi → 9) Copyediting → 10) Publikasi.\n\nJika Anda ingin, sebutkan langkah tertentu (mis. upload naskah, metadata, atau revisi) agar saya jelaskan lebih detail.",
            ],
            [
                'keywords' => ['submit', 'submission', 'kirim', 'unggah'],
                'answer' => "Cara submit artikel di OJS:\n- Siapkan file naskah sesuai template jurnal.\n- Pastikan file bersih dari identitas jika blind review.\n- Isi metadata: judul, abstrak, kata kunci, afiliasi, email penulis.\n- Unggah file utama + file pendukung bila diminta.\n- Centang checklist (etika, orisinalitas, format).\n- Konfirmasi submission dan pantau statusnya di dashboard OJS.\n\nJika Anda butuh panduan pada tahap tertentu, sebutkan tahapnya.",
            ],
            [
                'keywords' => ['review', 'peer', 'revisi', 'revision'],
                'answer' => "Proses peer-review biasanya: (1) cek awal editor, (2) review oleh reviewer, (3) revisi penulis, (4) keputusan editor.\n\nTips saat revisi:\n- Buat dokumen response to reviewers.\n- Jawab setiap komentar secara spesifik.\n- Jelaskan di mana perubahan dilakukan (halaman/paragraph).\n- Jika tidak setuju dengan reviewer, berikan alasan ilmiah yang sopan.\n\nIni meningkatkan peluang artikel diterima.",
            ],
            [
                'keywords' => ['template', 'format', 'gaya'],
                'answer' => "Template jurnal mengatur struktur artikel, gaya font, margin, heading, dan sitasi. Pastikan:\n- Judul & abstrak sesuai panjang yang diminta.\n- Struktur IMRaD diikuti.\n- Sitasi konsisten (APA/IEEE/Chicago dll.).\n- Tabel/figures diberi caption sesuai aturan.\n\nJika Anda punya template tertentu, saya bisa bantu menyesuaikan.",
            ],
            [
                'keywords' => ['struktur', 'outline', 'kerangka'],
                'answer' => "Struktur artikel ilmiah umumnya: Judul, Abstrak, Kata Kunci, Pendahuluan, Metode, Hasil, Pembahasan, Kesimpulan, dan Daftar Pustaka. Beberapa jurnal menambah: ucapan terima kasih, lampiran, dan data availability. Pastikan mengikuti author guidelines jurnal tujuan.",
            ],
            [
                'keywords' => ['sitasi', 'citation', 'referensi', 'daftar pustaka'],
                'answer' => "Etika sitasi sangat penting. Pastikan:\n- Setiap kutipan di teks tercantum di daftar pustaka.\n- Gunakan gaya sitasi yang diminta jurnal (APA/IEEE/Chicago/Vancouver).\n- Hindari sitasi yang tidak relevan.\n- Gunakan manajer referensi (Mendeley/Zotero) agar konsisten.\n\nIni membantu menghindari plagiarisme dan memperkuat argumen.",
            ],
            [
                'keywords' => ['plagiar', 'turnitin'],
                'answer' => "Sebagian besar jurnal meminta similarity rendah (mis. < 20%). Tips:\n- Hindari copy-paste.\n- Parafrase dengan benar.\n- Cantumkan sitasi untuk ide/data orang lain.\n- Cek ulang dengan Turnitin atau alat sejenis sebelum submit.",
            ],
            [
                'keywords' => ['abstrak', 'abstract'],
                'answer' => "Abstrak idealnya 150–250 kata dan memuat: tujuan, metode, hasil utama, dan kesimpulan. Hindari sitasi jika tidak diminta. Tulis dengan bahasa ringkas, padat, dan informatif karena abstrak jadi bagian pertama yang dibaca reviewer.",
            ],
            [
                'keywords' => ['metode', 'metodologi'],
                'answer' => "Bagian metode harus jelas agar penelitian bisa direplikasi. Jelaskan:\n- Desain penelitian\n- Subjek/sampel\n- Instrumen\n- Prosedur pengumpulan data\n- Teknik analisis data\n\nSemakin rinci, semakin baik kualitas metode Anda dinilai.",
            ],
            [
                'keywords' => ['hasil', 'pembahasan'],
                'answer' => "Hasil menyajikan temuan secara objektif (tabel/grafik). Pembahasan menafsirkan hasil, membandingkan dengan literatur, menjelaskan implikasi, serta keterbatasan penelitian.",
            ],
            [
                'keywords' => ['artikel', 'article'],
                'answer' => "Artikel ilmiah adalah tulisan sistematis berbasis penelitian yang bertujuan menyampaikan temuan ilmiah. Struktur umum: judul, abstrak, pendahuluan, metode, hasil, pembahasan, kesimpulan, dan daftar pustaka. Artikel biasanya melewati proses peer-review sebelum diterbitkan di jurnal.",
            ],
            [
                'keywords' => ['jurnal', 'journal'],
                'answer' => "Jurnal ilmiah adalah media publikasi penelitian yang terstruktur dan melalui review. Setiap jurnal memiliki scope, template, serta kebijakan etika. Pastikan artikel Anda sesuai scope dan ikuti author guidelines untuk meningkatkan peluang diterima.",
            ],
            [
                'keywords' => ['editorial'],
                'answer' => "Editorial berisi opini atau sudut pandang editor terhadap isu tertentu. Jika jurnal menerima editorial, formatnya biasanya lebih ringkas dari artikel penelitian dan fokus pada isu aktual atau kebijakan jurnal.",
            ],
        ];

        foreach ($intents as $intent) {
            if ($this->containsAny($normalized, $intent['keywords'])) {
                return $intent['answer'];
            }
        }

        return "Pertanyaan kamu terkait artikel/OJS/jurnal sudah saya terima. Bisa dijelaskan lebih spesifik bagian apa yang ingin dibahas (mis. submit, review, format, atau sitasi)?";
    }

    private function containsAny(string $text, array $keywords): bool
    {
        foreach ($keywords as $keyword) {
            if (str_contains($text, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function listConversations(int $userId): array
    {
        $conversations = ChatbotConversation::query()
            ->where('user_id', $userId)
            ->with(['messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderByDesc('updated_at')
            ->get();

        return $conversations->map(fn (ChatbotConversation $conversation) => $this->mapConversation($conversation))->values()->all();
    }

    private function listMessages(int $conversationId, int $userId): array
    {
        $conversation = ChatbotConversation::where('id', $conversationId)
            ->where('user_id', $userId)
            ->first();

        if (!$conversation) {
            return [];
        }

        return $conversation->messages()
            ->orderBy('id')
            ->get()
            ->map(fn (ChatbotMessage $message) => $this->mapMessage($message))
            ->values()
            ->all();
    }

    private function mapConversation(ChatbotConversation $conversation): array
    {
        if ($conversation->relationLoaded('messages')) {
            $latest = $conversation->messages->first();
        } else {
            $latest = $conversation->messages()->latest()->first();
        }

        return [
            'id' => $conversation->id,
            'title' => $conversation->title,
            'last_message' => $latest?->message,
            'last_time' => $latest?->created_at?->toDateTimeString(),
            'updated_at' => $conversation->updated_at?->toDateTimeString(),
        ];
    }

    private function mapMessage(ChatbotMessage $message): array
    {
        return [
            'id' => $message->id,
            'role' => $message->role,
            'message' => $message->message,
            'created_at' => $message->created_at?->toDateTimeString(),
        ];
    }

    private function findConversation(?int $conversationId, int $userId): ?ChatbotConversation
    {
        if (!$conversationId) {
            return null;
        }

        return ChatbotConversation::where('id', $conversationId)
            ->where('user_id', $userId)
            ->first();
    }

    private function assertOwner(ChatbotConversation $conversation, int $userId): void
    {
        if ($conversation->user_id !== $userId) {
            abort(403);
        }
    }

    private function generateTitle(string $message): string
    {
        $clean = trim(preg_replace('/[^a-z0-9\\s]/i', ' ', $message) ?? $message);
        $words = array_values(array_filter(explode(' ', $clean)));
        $titleWords = array_slice($words, 0, 6);
        $title = trim(implode(' ', $titleWords));

        return $title ?: 'Percakapan Baru';
    }

    private function askGemini(string $message): ?string
    {
        $key = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-2.5-pro');

        if (!$key) {
            return null;
        }

        $systemPrompt = implode("\n", [
            "Kamu adalah asisten untuk pertanyaan seputar artikel ilmiah, jurnal, dan OJS.",
            "Jawab dalam Bahasa Indonesia dengan penjelasan detail dan terstruktur (paragraf + poin).",
            "Berikan contoh langkah atau struktur jika relevan.",
            "Jika pertanyaan di luar topik (artikel/OJS/jurnal), tolak dengan sopan.",
        ]);

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => $systemPrompt],
                ],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $message],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.3,
                'topP' => 0.8,
                'maxOutputTokens' => 900,
            ],
        ];

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$key}";

        try {
            $response = Http::timeout(15)->post($url, $payload);
        } catch (\Throwable $e) {
            return null;
        }

        if (!$response->successful()) {
            return null;
        }

        $reply = data_get($response->json(), 'candidates.0.content.parts.0.text');

        $final = $reply ? trim($reply) : null;
        if (!$final) {
            return null;
        }

        if (str_word_count($final) < 60) {
            $final .= "\n\nJika ingin, jelaskan konteks lebih spesifik (mis. jenis jurnal, bidang ilmu, atau tahap OJS), agar saya dapat memberi panduan yang lebih mendalam.";
        }

        return $final;
    }
}
