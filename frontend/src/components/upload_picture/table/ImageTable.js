import React, { Component } from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import CloseCircleOutline from "mdi-material-ui/CloseCircleOutline";

export class ImageTable extends Component {


  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.images.map((image, i) => (
            <TableRow key={i}>
              <TableCell component="th">
                  <img src={image} height = {32}/>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => this.props.removeImage(image)}>
                  <CloseCircleOutline fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default ImageTable;
