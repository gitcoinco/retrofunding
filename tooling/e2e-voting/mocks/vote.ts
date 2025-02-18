export const mockVoteResponse = {
  success: {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      success: true,
      message: "Vote recorded successfully",
    }),
  },
  unauthorized: {
    status: 401,
    contentType: "application/json",
    body: JSON.stringify({
      success: false,
      message: "Not Authorzied",
    }),
  },
};
