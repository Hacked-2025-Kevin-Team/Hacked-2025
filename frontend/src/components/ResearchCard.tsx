import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
          {badges.map((badge, index) => (
            <Badge key={index}>{badge}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        >
          Read Full Paper
        </Button>
      </CardFooter>
    </Card>
  );
};
