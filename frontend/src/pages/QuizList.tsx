import AgreementDialog from "@components/atoms/AgreementDialog";
import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomLink from "@components/atoms/CustomLink";
import NotificationManager from "@components/atoms/NotificationManager";
import { Span } from "@components/atoms/Typography";
import withAuth from "@components/auth/withAuth";
import useAppTheme from "@hooks/useAppTheme";
import { Delete, Edit, Publish, RemoveRedEye } from "@mui/icons-material";
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  deleteQuizes,
  getMyQuizList,
  ListResponse,
  updateQuiz,
} from "@services/quizService";
import { Quiz } from "@shared/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@utils/axiosUtils";
import { isSelected, selectHandler } from "@utils/tableUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tableHeaders = ["Title", "Total Questions", "Status", "Action"];

const QuizList = () => {
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [deletableQuiz, setDeletableQuiz] = useState<Quiz | undefined>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { palette } = useAppTheme();
  const { error, success } = palette;

  const { isLoading, data } = useQuery<ListResponse<Quiz>>(
    ["/quiz", page, rowsPerPage],
    () => getMyQuizList(page, rowsPerPage),
    { keepPreviousData: true }
  );
  const quizList = data?.data ?? [];
  const totalQuiz = data?.total ?? 0;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = quizList?.map((n: any) => n._id) ?? [];
      setSelectedItems(newSelecteds);
      return;
    }
    setSelectedItems([]);
  };

  const handleSelectionChange = (selected: string[], id: string) => () => {
    setSelectedItems(selectHandler(selected, id));
  };

  const handlePageChange = (_e: unknown, newPage: number) => {
    setPage(newPage);
    setSelectedItems([]);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    setSelectedItems([]);
  };

  const toggleAgreement = () => {
    if (agreementOpen) setDeletableQuiz(undefined);
    setAgreementOpen(!agreementOpen);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      let idList = [];
      if (deletableQuiz) {
        idList.push(deletableQuiz._id as string);
      } else {
        idList = selectedItems;
      }

      await deleteQuizes(idList);
      setSelectedItems([]);
      setDeletableQuiz(undefined);

      // move to previous page if current page is empty
      const hasNextPageData = Math.ceil(totalQuiz / rowsPerPage) > page + 1;
      if (quizList.length === idList.length && !hasNextPageData && page > 0) {
        setPage((page) => page - 1);
      }

      queryClient.invalidateQueries(["/quiz"]);
      queryClient.removeQueries(idList.map((id) => `/quiz/${id}`));
    } catch (error) {
      const message = getErrorMessage(error);
      NotificationManager.error(message);
    }
    setIsDeleting(false);
    toggleAgreement();
  };

  const handlePublishQuiz = (quiz: Quiz) => async () => {
    try {
      const { publishId } = await updateQuiz({ ...quiz, published: true });
      NotificationManager.success("Quiz published successfully");
      queryClient.invalidateQueries(["/quiz"]);
      queryClient.invalidateQueries([`/quiz/${quiz._id}`]);
      navigate(`/publish/${publishId}`);
    } catch (error) {
      const message = getErrorMessage(error);
      NotificationManager.error(message);
    }
  };

  return (
    <Container sx={{ my: { xs: "1rem", sm: "2rem" } }}>
      <Card
        sx={{
          p: {
            xs: "1.25rem",
            md: "1.5rem",
          },
        }}
      >
        {isLoading ? (
          <CustomFlexBox sx={{ justifyContent: "center", my: "1rem" }}>
            <CircularProgress size={24} />
          </CustomFlexBox>
        ) : (
          <>
            <Collapse in={selectedItems.length > 0}>
              <CustomBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  mb: "1rem",
                }}
              >
                <Span sx={{ mr: "20px" }} color="inherit">
                  {selectedItems.length} selected
                </Span>
                <Button
                  variant="contained"
                  color="error"
                  onClick={toggleAgreement}
                >
                  <Delete sx={{ mr: "4px", fontSize: 20 }} />
                  Delete
                </Button>
              </CustomBox>
            </Collapse>
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <TableHead
                  sx={{
                    bgcolor: "grey.100",
                    th: { py: "4px", border: "none" },
                  }}
                >
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ color: "#757575" }}
                        onChange={handleSelectAllClick}
                        indeterminate={
                          selectedItems.length > 0 &&
                          selectedItems.length < quizList.length
                        }
                        checked={
                          quizList.length > 0 &&
                          selectedItems.length === quizList.length
                        }
                      />
                    </TableCell>
                    {tableHeaders.map((headerName) => (
                      <TableCell sx={{ whiteSpace: "nowrap" }} key={headerName}>
                        {headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizList.map((quiz) => {
                    const isItemSelected = isSelected(
                      quiz._id ?? "",
                      selectedItems
                    );

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={quiz._id}
                        selected={isItemSelected}
                        id="TableBodyRow"
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{ color: "#757575" }}
                            checked={isItemSelected}
                            onClick={handleSelectionChange(
                              selectedItems,
                              quiz._id ?? ""
                            )}
                          />
                        </TableCell>
                        <TableCell align="left">{quiz.title}</TableCell>
                        <TableCell align="left">
                          {quiz.questions.length}
                        </TableCell>
                        <TableCell align="left">
                          <Span
                            sx={{
                              p: "2px 8px",
                              fontSize: "12px",
                              borderRadius: "4px",
                              whiteSpace: "nowrap",
                              color: quiz.published ? success.main : error.main,
                              bgcolor: quiz.published ? "#EAFBF4" : "#FFEBF1",
                            }}
                          >
                            {quiz.published ? "Published" : "Not Published"}
                          </Span>
                        </TableCell>
                        <TableCell align="left">
                          <CustomFlexBox sx={{ ml: "-5px" }}>
                            {quiz.published ? (
                              <CustomLink to={`/quiz/${quiz.publishId}`}>
                                <Tooltip title="View" placement="top">
                                  <IconButton>
                                    <RemoveRedEye
                                      sx={{
                                        fontSize: "20px",
                                        color: "grey.600",
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </CustomLink>
                            ) : (
                              <Tooltip title="Publish" placement="top">
                                <IconButton onClick={handlePublishQuiz(quiz)}>
                                  <Publish
                                    sx={{
                                      fontSize: "20px",
                                      color: "grey.600",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            <CustomLink to={`/edit-quiz/${quiz._id}`}>
                              <Tooltip title={"Edit"} placement="top">
                                <IconButton>
                                  <Edit
                                    sx={{
                                      fontSize: "20px",
                                      color: "grey.600",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </CustomLink>
                            <Tooltip title={"Delete"} placement="top">
                              <IconButton
                                onClick={() => {
                                  setDeletableQuiz(quiz);
                                  setSelectedItems([]);
                                  toggleAgreement();
                                }}
                              >
                                <Delete
                                  sx={{ fontSize: "20px", color: "grey.600" }}
                                />
                              </IconButton>
                            </Tooltip>
                          </CustomFlexBox>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={totalQuiz}
              rowsPerPageOptions={[10, 20, 50, 100]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </Card>
      {agreementOpen && (
        <AgreementDialog
          open={agreementOpen}
          text="Are you sure you to delete?"
          isLoading={isDeleting}
          onAgree={handleDelete}
          onDisagree={toggleAgreement}
        />
      )}
    </Container>
  );
};

export default withAuth(QuizList);
