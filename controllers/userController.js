export const logout = async (req, res) => {
  try {
    res.send({ done: true });
  } catch (error) {
    console.log(error);
  }
};
