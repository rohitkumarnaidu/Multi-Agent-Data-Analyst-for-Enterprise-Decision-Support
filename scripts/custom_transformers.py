from sklearn.base import BaseEstimator, TransformerMixin

class ColumnDropper(BaseEstimator, TransformerMixin):
    def __init__(self, drop_cols=None):
        self.drop_cols = drop_cols if drop_cols else []
        
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        X = X.copy()
        to_drop = [c for c in self.drop_cols if c in X.columns]
        return X.drop(columns=to_drop)
