CREATE FUNCTION dbo.EncodeFieldsToHex (
    @CUIL NVARCHAR(50),
    @DNI NVARCHAR(50),
    @ACTIVO NVARCHAR(10)
)
RETURNS VARBINARY(MAX)
AS
BEGIN
    DECLARE @combinedString NVARCHAR(MAX)
    DECLARE @hexEncoded VARBINARY(MAX)

    -- Step 1: Combine the input fields into a single comma-separated string
    SET @combinedString = @CUIL + ',' + @DNI + ',' + @ACTIVO + ','

    -- Step 2: Convert the combined string to a hex-encoded VARBINARY format
    SET @hexEncoded = CONVERT(VARBINARY(MAX), @combinedString)

    RETURN @hexEncoded
END
