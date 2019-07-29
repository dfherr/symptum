import React, { Component } from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import CloseCircleOutline from "mdi-material-ui/CloseCircleOutline";


export class IngredientsTable extends Component {


    render() {
        return (
            <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ingredient</TableCell>
                <TableCell>Concentration in mg</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {this.props.ingredients.map((ingredient, i) =>
                    <TableRow key={i}>
                    <TableCell>
                        {ingredient.name}
                    </TableCell>
                    <TableCell>
                    {ingredient.concentration}
                    </TableCell>
                    <TableCell>
                    <IconButton onClick={() => this.props.onIngredientRemoved(ingredient)}>
                  <CloseCircleOutline fontSize="small" />
                </IconButton>
                    </TableCell>
                </TableRow>

                )}
                
                <TableRow></TableRow>
                <TableRow></TableRow>
            </TableBody>
          </Table>
        )
    }
}

export default IngredientsTable
