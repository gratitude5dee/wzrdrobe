export function Logo() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <div className="relative w-128 h-64 animate-float">
        <div className="flex justify-center mb-4">
          <img
            src="/morflax-studio-31--unscreen.gif"
            alt="WZRD Animation"
            width={400}
            height={240}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-center text-purple-100 tracking-wider">WZRDROBE</h1>
        <p className="text-xl md:text-2xl text-center text-purple-200 mt-2">Virtual Try-On Studio</p>
      </div>
    </div>
  )
}
