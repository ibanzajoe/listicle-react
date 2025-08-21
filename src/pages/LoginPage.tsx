import LoginForm from "@/components/auth/LoginForm";
import FloatingIconsBackground from "@/components/utils/BouncingIconBackground";

export default function LoginPage() {
    return (
        <div className="login-page flex items-center justify-center min-h-screen ">
            <FloatingIconsBackground />
            <LoginForm />
        </div>
    )
}