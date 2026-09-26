import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export const useLandingPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    if (!slug) navigate("/");

    const { data, isLoading, error } = useQuery({
        queryKey: ["landing_page", slug],
        queryFn: async () => {
            const response = await apiClient.get(`/landing-pages/slug/${slug}`);
            return response.data;
        },
    });

    return { data, isLoading, error, slug };
};
