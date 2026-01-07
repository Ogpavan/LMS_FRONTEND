import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  CustomModal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "@/components/ui/CustomModal.jsx";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    const result = await signup(formData);

    if (result.success) {
      setShowSuccess(true);
    } else {
      setError(result.error);
      setShowErrorModal(true);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Success Modal */}
      <CustomModal open={showSuccess} onOpenChange={setShowSuccess}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Signup Successful</ModalTitle>
            <ModalDescription>
              Your account has been created! You can now sign in.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/auth/signin");
                }}
              >
                Go to Sign In
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </CustomModal>

      {/* Error Modal */}
      <CustomModal open={showErrorModal} onOpenChange={setShowErrorModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Signup Failed</ModalTitle>
            <ModalDescription>
              {error || "An unknown error occurred."}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button onClick={() => setShowErrorModal(false)}>Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </CustomModal>

      <div className="min-h-screen flex items-center justify-center from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_4px_15px_rgba(0,0,0,0.06)] space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 text-sm mt-1">
              Create your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="h-10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="h-10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              variant="default"
              className={"w-full"}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/signin"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
