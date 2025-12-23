import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';

export function Link({ to, href, method, as, replace, ...props }) {
    const target = href ?? to ?? '#';

    return (
        <InertiaLink
            href={target}
            method={method}
            as={as}
            replace={replace}
            {...props}
        />
    );
}

export function useNavigate() {
    return useCallback((to, options = {}) => {
        if (typeof to === 'number') {
            window.history.go(to);
            return;
        }

        const target = to ?? options.to;
        if (!target) return;

        router.visit(target, {
            method: options.method ?? 'get',
            data: options.data ?? undefined,
            replace: options.replace ?? false,
            preserveScroll: options.preserveScroll ?? false,
            preserveState: options.preserveState ?? false,
        });
    }, []);
}

export function useParams() {
    const { url, props } = usePage();

    if (props?.params && typeof props.params === 'object') {
        return props.params;
    }

    const path = url.split('?')[0];
    const segments = path.split('/').filter(Boolean);
    const params = {};

    const meetingIndex = segments.indexOf('meetings');
    if (meetingIndex !== -1 && segments[meetingIndex + 1]) {
        params.id = segments[meetingIndex + 1];
    }

    const userIndex = segments.indexOf('users');
    if (!params.id && userIndex !== -1 && segments[userIndex + 1]) {
        params.id = segments[userIndex + 1];
    }

    return params;
}
