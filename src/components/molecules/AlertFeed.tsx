import { BadgeAlert, QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import React from "react";

const AlertFeed = () => {
  const [alerts, setAlerts] = React.useState([]);
  

  return (
    <>
      {/* Alert Feed */}
      <Card className="mt-6 bg-[#1C1C1E] border-gray-800">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-gray-400">No recent alerts</p>
            ) : (
              alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-2 p-3 bg-[#2C2C2E] rounded-lg"
                >
                  <BadgeAlert className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-400">{alert.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AlertFeed;
