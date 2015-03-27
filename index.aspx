<%@Page Language="C#"%>
<%@Import Namespace="System.IO"%>
<%
var files = new List<string>();
foreach(var file in Directory.GetFiles(Server.MapPath("/")).Where(f => !f.ToLower().EndsWith(".aspx") && !f.ToLower().EndsWith(".config")))
{
    files.Add("\"" + Path.GetFileName(file) + "\"");
}
Response.ContentType = "application/json";
Response.Write("[" + string.Join(",", files.ToArray()) + "]");
%>