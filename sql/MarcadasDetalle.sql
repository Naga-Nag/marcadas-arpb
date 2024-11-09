CREATE OR ALTER FUNCTION dbo.MarcadasDetalle(@Userid NVARCHAR(10), @Fecha DATE)
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
  ),
  UserInfoWithDetails AS (
    SELECT 
      U.*,
      p.CUIL,
      p.DNI,
      p.ACTIVO
    FROM 
      Userinfo U
    LEFT JOIN dbo.ParseHexFieldsToTable(U.OtherInfo) AS p ON U.Userid = p.CUIL -- Use CUIL for potential join (assuming CUIL is unique)
  )
  SELECT 
    UID = CM.Userid, 
    MR = U.Usercode, 
    Nombre = U.Name, 
    Departamento = D.DeptName, 
    Marcada = CM.Checktime, 
    TipoMarca = CM.TipoMarca,
    CUIL = UW.CUIL,
    DNI = UW.DNI,
    ACTIVO = UW.ACTIVO
  FROM 
    ClasificacionMarcas CM
  INNER JOIN 
    UserInfoWithDetails UW ON CM.Userid = UW.Userid -- Use Userid for fallback
  INNER JOIN 
    Dept D ON UW.Deptid = D.Deptid
)