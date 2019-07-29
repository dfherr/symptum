import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Styles } from "./styles";

/**
 * Props:
 *  - imageUrl : string
 *  - title : string
 *  - content : string
 */
class DrugItem extends React.Component {
 
  render() {
    const drug = this.props.drug;
    let advertised = Date.parse(drug.adUntil) > Date.now() ? true : false;
    return (
      <Card style={Styles.card}>
        <CardActionArea>
          <CardMedia component="img" height="200" src={drug.imageUrl} />
          <CardContent>
            <Typography style={Styles.title} variant="h6" component="h6">
              {drug.name}
            </Typography>
            <Typography style={Styles.content} variant="h5" component="h5">
              {drug.price + "€"}
            </Typography>
            <Typography style={advertised ? Styles.advertised : {visibility: "hidden"}} variant="body1">
              Ad
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default DrugItem;
