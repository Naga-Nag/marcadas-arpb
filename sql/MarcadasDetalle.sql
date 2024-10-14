CREATE FUNCTION dbo.MarcadasDetalle(@Userid NVARCHAR(10), @Fecha DATE)
RETURNS TABLE
AS
RETURN
(
    WITH MarcasOrdenadas AS (
        SELECT 
            C.Userid, 
            C.Checktime,
            ROW_NUMBER() OVER (PARTITION BY C.Userid ORDER BY C.Checktime) AS NumeroMarca
        FROM 
            Checkinout C
        WHERE 
            C.Userid = @Userid
            AND CAST(C.Checktime AS DATE) = @Fecha
    ),
    ClasificacionMarcas AS (
        SELECT 
            MO.Userid, 
            MO.Checktime,
            CASE
                WHEN MO.NumeroMarca = 1 THEN 'Entrada'
                WHEN MO.NumeroMarca = (SELECT MAX(NumeroMarca) FROM MarcasOrdenadas) THEN 'Salida'
                WHEN MO.NumeroMarca % 2 = 1 THEN 'Entrada Intermedia'
                ELSE 'Salida Intermedia'
            END AS TipoMarca
        FROM 
            MarcasOrdenadas MO
    )
    SELECT 
        CM.Userid AS UID, 
        U.Usercode AS MR, 
        U.Name AS Nombre, 
        D.DeptName AS Departamento, 
        CM.Checktime AS Marcada, 
        CM.TipoMarca
    FROM 
        ClasificacionMarcas CM
    INNER JOIN 
        Userinfo U ON CM.Userid = U.Userid
    INNER JOIN 
        Dept D ON U.Deptid = D.Deptid
)