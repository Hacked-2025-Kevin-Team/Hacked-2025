import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ResearchCard = ({
  title,
  badges,
  description,
  url,
}: {
  title: string;
  badges: string[];
  description: string;
  url: string;
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <div className="flex flex-wrap gap-1">
          {badges.map((badge, index) => (
            <Badge key={index} className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Button
          variant="outline"
          className="w-full sm:w-auto text-sm"
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        >
          Read Full Paper
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto text-sm">
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Save for Later
        </Button>
      </CardFooter>
    </Card>
  );
};
