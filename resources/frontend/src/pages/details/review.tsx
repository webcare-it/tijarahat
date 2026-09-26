import { useGetReviews } from "@/api/queries/useGetReviews";
import { useSubmitReviewMutation } from "@/api/mutations/useReview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { getUserId } from "@/helper";

interface ReviewType {
  user_id: number;
  user_name: string;
  avatar: string;
  rating: number;
  comment: string;
  time: string;
}

export const ProductReviews = () => {
  const { data, isLoading } = useGetReviews();

  const reviews = (data?.data as ReviewType[]) || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">
        {"Customer Reviews"}
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : reviews?.length > 0 ? (
        reviews?.map((review, index: number) => (
          <div key={index} className="border rounded-lg p-2 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar>
                <AvatarImage src={review?.avatar} />
                <AvatarFallback>{review?.user_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex justify-between w-full items-center">
                <div>
                  <p className="font-medium text-sm md:text-base text-foreground">
                    {review?.user_name}
                  </p>
                  <div className="flex items-center gap-0.5 md:gap-1">
                    {[...Array(review?.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3 h-3 md:w-4 md:h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs md:text-nowrap md:text-sm text-muted-foreground">
                {review?.time}
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {review?.comment}
            </p>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{"No reviews found"}</p>
        </div>
      )}
      <GiveReviewForm />
    </div>
  );
};

const GiveReviewForm = () => {
  const { id } = useParams();

  const { mutate, isPending } = useSubmitReviewMutation();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    if (!rating || comment.trim().length === 0) return;

    const formData = new FormData();
    formData.append("product_id", id as string);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);
    formData.append("user_id", getUserId() as string);
    mutate(formData);
    setComment("");
    setRating(0);
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-3 md:p-4 space-y-4">
      <h4 className="text-base md:text-lg font-semibold text-foreground">
        {"Write a review"}
      </h4>

      <div className="space-y-2">
        <Label>{"Your rating"}</Label>
        <div className="flex items-center gap-2">
          {stars.map((star) => {
            const active = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                aria-label={`rate-${star}`}
                className="p-1 cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}>
                <svg
                  className={`w-6 h-6 ${
                    active ? "text-yellow-500" : "text-muted-foreground"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">{"Your comment"} *</Label>
        <Textarea
          id="comment"
          name="comment"
          required
          placeholder={"Share your experience..."}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !rating || comment.trim().length === 0}>
          {isPending ? (
            <>
              <Spinner /> {"Processing..."}
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
};
