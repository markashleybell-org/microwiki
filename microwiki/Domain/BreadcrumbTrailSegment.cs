namespace MicroWiki.Domain
{
    public class BreadcrumbTrailSegment
    {
        public BreadcrumbTrailSegment(string title)
            : this(title, default)
        {
        }

        public BreadcrumbTrailSegment(string title, string location)
        {
            Title = title;
            Location = location;
        }

        public string Title { get; }

        public string Location { get; }

        public bool ReadOnly =>
            string.IsNullOrWhiteSpace(Location);
    }
}
