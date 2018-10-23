export function wrapResponse(res, actionPromise) {
  return actionPromise
    .then(result => {
      res.status(200).json({ data: result });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
}
