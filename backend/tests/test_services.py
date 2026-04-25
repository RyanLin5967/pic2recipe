from services.recommendation import get_recommendations
def test_service(mock_repo, mock_transformer, db_session):
    results = get_recommendations(["chicken", "pizza"], mock_transformer, db_session)
    print(f"Type of results: {type(results)}")
    print(f"First item: {results[0]}")
    assert results[0].title == "Double Choc Muffins"