import Foundation
import PDFKit
import Vision
import AppKit

// Usage: ocr-pdf <input.pdf> <output.txt>
guard CommandLine.arguments.count >= 3 else {
    FileHandle.standardError.write("usage: ocr-pdf <input.pdf> <output.txt>\n".data(using: .utf8)!)
    exit(1)
}
let inPath = CommandLine.arguments[1]
let outPath = CommandLine.arguments[2]

guard let doc = PDFDocument(url: URL(fileURLWithPath: inPath)) else {
    FileHandle.standardError.write("cannot open pdf: \(inPath)\n".data(using: .utf8)!)
    exit(1)
}

var output = ""
let scale: CGFloat = 2.0

for i in 0..<doc.pageCount {
    guard let page = doc.page(at: i) else { continue }
    let bounds = page.bounds(for: .mediaBox)
    let target = CGSize(width: max(bounds.width * scale, 1), height: max(bounds.height * scale, 1))
    let thumb = page.thumbnail(of: target, for: .mediaBox)
    guard let cg = thumb.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true

    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do {
        try handler.perform([request])
    } catch {
        FileHandle.standardError.write("ocr failed page \(i + 1): \(error)\n".data(using: .utf8)!)
        continue
    }

    if let results = request.results {
        for obs in results {
            if let top = obs.topCandidates(1).first {
                output += top.string + "\n"
            }
        }
    }
    output += "\n"
    FileHandle.standardError.write("page \(i + 1)/\(doc.pageCount)\n".data(using: .utf8)!)
}

do {
    try output.write(toFile: outPath, atomically: true, encoding: .utf8)
    print("wrote \(outPath) (\(output.count) chars)")
} catch {
    FileHandle.standardError.write("write failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}
