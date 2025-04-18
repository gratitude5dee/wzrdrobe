export function Background() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(104,14,142,0.2)_0%,rgba(13,9,24,1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(104,14,142,0.2),rgba(13,9,24,0.8))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_-20%,rgba(104,14,142,0.3),transparent_70%)]" />
        <div className="absolute inset-0 opacity-50 mix-blend-overlay">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4NCjxmaWx0ZXIgaWQ9ImEiIHg9IjAiIHk9IjAiPg0KPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPg0KPC9maWx0ZXI+DQo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+DQo8L3N2Zz4=')]" />
        </div>
      </div>
    </>
  )
}
