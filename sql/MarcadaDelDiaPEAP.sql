CREATE FUNCTION MarcadaDelDia(@FechaHoy DATE) 
RETURNS @Resultado TABLE 
(
    MR INT,
    Nombre VARCHAR(100),
    Departamento VARCHAR(100),
    Salida DATETIME,
    Entrada DATETIME
)
AS
BEGIN
    INSERT INTO @Resultado
    SELECT
        ui.UserCode,
        ui.Name,
        d.DeptName,
        MAX(CASE WHEN DATEPART(HOUR, ci.CheckTime) >= 13 AND (CAST(ci.CheckTime AS DATE) = @FechaHoy) THEN ci.CheckTime END) AS Salida,
        MIN(CASE WHEN DATEPART(HOUR, ci.CheckTime) <= 10 AND (CAST(ci.CheckTime AS DATE) = @FechaHoy) THEN ci.CheckTime END) AS Entrada
    FROM
        dbo.Userinfo ui
        INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
        LEFT JOIN dbo.Checkinout ci ON ui.Userid = ci.Userid
    GROUP BY
        ui.UserCode, ui.Name, d.DeptName
    RETURN
END
