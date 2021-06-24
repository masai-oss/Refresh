import { useEffect } from "react";
import { adminActions } from "../State/action";
import { useSelector, useDispatch } from "react-redux";
import { Row } from "./Row";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

export const PracticeQuestionsByTopic = ({
  topic,
  handleDisable,
  topics,
  page,
  rowsPerPage,
  disabledFilter,
  reportedFilter
}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.admin.data);
  const isLoading = useSelector((state) => state.admin.isLoading);
  const questionAddedStatus = useSelector(
    (state) => state.admin.questionAddedStatus
  );
  const history = useHistory();

  const handleChangePage = (event, newPage) => {
    const params = new URLSearchParams();
    params.append("page", newPage + 1);
    params.append("rowsPerPage", rowsPerPage);
    params.append("disabledFilter", disabledFilter)
    params.append("reportedFilter", reportedFilter)
    history.push({ search: params.toString() });
  };

  const handleChangeRowsPerPage = (event) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("rowsPerPage", event.target.value);
    params.append("disabledFilter", disabledFilter)
    params.append("reportedFilter", reportedFilter)
    history.push({ search: params.toString() });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("disabledFilter", disabledFilter)
    params.set("reportedFilter", reportedFilter)
    history.push({ search: params.toString() });
    dispatch(adminActions.getQuestionsByTopicRequest(topic, page, rowsPerPage, disabledFilter, reportedFilter, "LONG"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    questionAddedStatus,
    page,
    rowsPerPage,
    topic,
    dispatch,
    disabledFilter,
    reportedFilter,
    history
  ]);

  return (isLoading || !data?.questions?.current) ? (
    <div style = {{textAlign: "center", marginTop: "20px"}}>...isLoading</div>
  ) : (data?.questions?.current?.length === 0) ? (
    <div style = {{textAlign: "center", marginTop: "20px"}}>No questions</div>
  ) : (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Reports</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Disable</TableCell>
            <TableCell>Verified</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.questions?.current?.length &&
            data?.questions?.current?.map((item) => (
              <Row
                handleDisable={handleDisable}
                key={item._id}
                item={item}
                topic={topic}
              />
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data?.questions?.totalCount}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};
