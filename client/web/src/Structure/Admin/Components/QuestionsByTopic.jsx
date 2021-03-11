import { useEffect, useState } from 'react'
import { getQuestionsByTopicRequest } from '../State/actions'
import { useSelector, useDispatch } from "react-redux";
import { Row } from '../'
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

export const QuestionsByTopic = ({val, handleDelete}) => {
    const dispatch = useDispatch();
    const {data} = useSelector( state => state.admin )
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(event.target.value);
      setPage(0);
    };

    useEffect(() => {
        dispatch(getQuestionsByTopicRequest(val))
    }, [])

    return (
        data && data.questions.length > 0 ? <>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>topic</TableCell>
                            <TableCell>type</TableCell>
                            <TableCell>edit</TableCell>
                            <TableCell>delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { data.questions?.map( (item, idx) => {
                            item.topic = val
                            return idx < (page + 1) * rowsPerPage && idx >= (page) * rowsPerPage && <Row handleDelete={handleDelete} key={item._id} item={item} />
                        } ) } 
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={data.questions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </> : <div>Loading...</div>
    )
}