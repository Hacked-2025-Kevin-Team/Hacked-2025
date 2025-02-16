import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ResearchCard = ({
  title,
  badges,
  description,
  insights,
  caution,
}: {
  title: string;
  badges: string[];
  description: string;
  insights: string[];
  caution?: string;
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
        {caution && (
          <div className="flex items-center mt-2 text-yellow-500">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs">{caution}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Key Insights:</h4>
          <ul className="list-disc list-inside text-sm">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Read Full Paper</Button>
        <Button variant="ghost">
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Save for Later
        </Button>
      </CardFooter>
    </Card>
  );
};
