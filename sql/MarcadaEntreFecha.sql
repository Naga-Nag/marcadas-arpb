CREATE FUNCTION MarcadaEntreFECHAS(@FechaInicio DATE, @FechaFin DATE) 
RETURNS @Resultado TABLE 
(
    UID INT,
    MR INT,
    Nombre VARCHAR(100),
    Departamento VARCHAR(100)
)
AS
BEGIN
    INSERT INTO @Resultado
    SELECT
        ui.Userid,
        ui.UserCode,
        ui.Name,
        d.DeptName
    FROM
        dbo.Userinfo ui
        INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
        LEFT JOIN dbo.Checkinout ci ON ui.Userid = ci.Userid
    WHERE
        ci.CheckTime BETWEEN @FechaInicio AND @FechaFin
    RETURN
END
;