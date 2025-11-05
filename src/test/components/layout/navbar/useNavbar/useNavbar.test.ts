import { useNavbar } from "@/components/layout/navbar/hooks/useNavbar";
import { useSocketContext } from "@/context/SocketContext";
import { renderHook, act, cleanup } from "@testing-library/react";
import { Socket } from "socket.io-client";
import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
}));

vi.mock("next/router", () => ({
    Router: {
        events: {
            on: vi.fn(),
            off: vi.fn(),
        },
    },
}));

const setLoadingMock = vi.fn();

vi.mock("@/store/loadingStore", () => ({
    useLoadingStore: (
        selector: (store: { setLoading: typeof setLoadingMock }) => unknown
    ) => selector({ setLoading: setLoadingMock }),
}));

vi.mock("@/store/themeStore", () => ({
    useThemeStore: (
        selector: (store: {
            isDarkMode: boolean;
            toggleTheme: () => void;
        }) => unknown
    ) => selector({ isDarkMode: false, toggleTheme: () => { } }),
}));

vi.mock("@/context/SocketContext");

describe("useNavbar", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSocketContext).mockReturnValue({
            online: true,
            socket: { emit: vi.fn() } as unknown as Socket,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("should initialize with correct default values", () => {
        const { result } = renderHook(() => useNavbar());
        expect(result.current.mobileMenuOpen).toBe(false);
        expect(result.current.logoSrc).toBe("https://s6s2oxgnpnutegmr.public.blob.vercel-storage.com/Imagenes/LogoAndres.svg");
        expect(typeof result.current.handleClickLink).toBe("function");
        expect(typeof result.current.handleContactClick).toBe("function");
        expect(typeof result.current.toggleMobileMenu).toBe("function");
    });

    it("should toggle mobile menu state", () => {
        const { result } = renderHook(() => useNavbar());

        act(() => {
            result.current.toggleMobileMenu();
        });

        expect(result.current.mobileMenuOpen).toBe(true);

    })

    it("should handle link click and set loading", () => {
        const { result } = renderHook(() => useNavbar());
        act(() => {
            result.current.handleClickLink();
        });

        expect(setLoadingMock).toHaveBeenCalledWith(true);
        expect(result.current.mobileMenuOpen).toBe(false);
    });


    it("should close mobile menu", () => {
        const { result } = renderHook(() => useNavbar());

        act(() => {
            result.current.toggleMobileMenu();
        });
        expect(result.current.mobileMenuOpen).toBe(true);

        act(() => {
            result.current.closeMobileMenu();
        });

        expect(result.current.mobileMenuOpen).toBe(false);
    });

    

})