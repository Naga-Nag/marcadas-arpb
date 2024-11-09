CREATE OR ALTER FUNCTION dbo.ParseHexFieldsToTable (@binaryInput VARBINARY(MAX))
RETURNS @ParsedTable TABLE (
    CUIL NVARCHAR(50),
    DNI NVARCHAR(50),
    ACTIVO NVARCHAR(10)
)
AS
BEGIN
    DECLARE @decodedString NVARCHAR(MAX)

    -- Step 1: Decode the VARBINARY input directly to an ASCII string
    SET @decodedString = CONVERT(VARCHAR(MAX), @binaryInput)

    -- Step 2: Convert the decoded string to an XML format for easy parsing
    DECLARE @xmlString NVARCHAR(MAX) = '<root><field>' + 
                                       REPLACE(@decodedString, ',', '</field><field>') + 
                                       '</field></root>'

    DECLARE @xml XML = CAST(@xmlString AS XML)

    -- Step 3: Extract values from the XML and insert them into the table
    INSERT INTO @ParsedTable (CUIL, DNI, ACTIVO)
    SELECT 
        T.C.value('(field[1])[1]', 'NVARCHAR(50)') AS CUIL,
        T.C.value('(field[2])[1]', 'NVARCHAR(50)') AS DNI,
        T.C.value('(field[3])[1]', 'NVARCHAR(10)') AS ACTIVO
    FROM @xml.nodes('/root') AS T(C)

    RETURN
END
