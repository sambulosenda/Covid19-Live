import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

function infoBox({ title, cases, total }) {
  return (
    <Card>
      <CardContent>
        <Typography className="infoBox__title"color="textSecondary">
        {title}
        </Typography>

        <h2 className="infoBox_cases">Cases</h2>

        <Typography className="infoBox_total" color="textSecondary">
        {total} Total
        </Typography>
        
      </CardContent>
    </Card>
  );
}

export default infoBox;
