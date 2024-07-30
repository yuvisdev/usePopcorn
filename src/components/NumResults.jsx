const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies && movies.length}</strong> results
    </p>
  );
};

export default NumResults;
