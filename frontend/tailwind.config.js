var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["Manrope", "sans-serif"],
                body: ["Plus Jakarta Sans", "sans-serif"]
            },
            colors: {
                brand: {
                    50: "#f5f5f7",
                    100: "#e5e5e7",
                    300: "#a1a1aa",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    900: "#18181b"
                },
                neutral: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    700: "#334155",
                    900: "#0f172a"
                },
                accent: {
                    500: "#f59e0b",
                    600: "#d97706"
                },
                success: {
                    500: "#22c55e"
                },
                danger: {
                    500: "#ef4444"
                },
                slateBg: "#09090b"
            },
            boxShadow: {
                card: "0 10px 30px -12px rgba(15, 23, 42, 0.25)"
            },
            backgroundImage: {
                "hero-gradient": "radial-gradient(circle at 18% 24%, rgba(161, 161, 170, 0.16), transparent 46%), radial-gradient(circle at 88% 8%, rgba(113, 113, 122, 0.14), transparent 42%), radial-gradient(circle at 50% 100%, rgba(82, 82, 91, 0.1), transparent 56%)"
            }
        },
        screens: {
            xs: "420px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        }
    },
    plugins: []
};
export default config;
