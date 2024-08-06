import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@openstudio/ui/components/ui/card";
import { ReactNode } from "react";

export function StatsCards(props: {
  stats: {
    name: string;
    value: string | number;
    subValue?: string;
    icon: ReactNode;
  }[];
}) {
  return (
    <div className="grid gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {props.stats.map((stat) => {
        return (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">{stat.subValue}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
