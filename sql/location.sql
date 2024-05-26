SELECT
    loc.*
FROM
    Tag t
    JOIN TagMap tm ON t.TagId = tm.TagId
    JOIN PlaylistItemLocationMap plilm ON tm.PlaylistItemId = plilm.PlaylistItemId
    JOIN Location loc ON plilm.LocationId = loc.LocationId
GROUP BY
    loc.LocationId;