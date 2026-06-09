import asyncio
import json
import os
import edge_tts

SAMPLES = [
    {
        "id": "sample-1",
        "voice": "en-US-ChristopherNeural",
        "text": """Dyslexia is a natural learning difference that affects how the brain processes written language. It is not a reflection of a person's intelligence, creativity, or cognitive capability. In fact, many individuals with dyslexia are highly creative, hands-on problem solvers who excel in visual and spatial reasoning.

Research in cognitive science shows that traditional typographic layouts can create visual crowding. Visual crowding occurs when letters and words are packed too closely together, causing them to blur, rotate, or overlap in the reader's perception. To mitigate this effect, specific formatting adjustments can be applied:

1. Dyslexia-friendly Fonts: Typefaces like OpenDyslexic or Lexend are designed with unique characteristics. OpenDyslexic uses heavy, weighted bottoms to ground letters, making it harder for the brain to mentally rotate them. Lexend uses clean, highly-differentiated geometric characters to improve parsing speeds.

2. Generous Line Height and Letter Spacing: Setting the line height to 1.5x or 2.0x and expanding letter spacing prevents text lines from bleeding into each other. This creates a visual harbor for each word, allowing the eye to track from left to right without skipping lines.

3. Eye-Anchoring Bolding (Bionic Reading): Highlighting the first few letters of each word serves as a visual anchor. The brain recognizes words by their shapes rather than reading every letter. By bolding the initial syllables, the eye slides smoothly through the text, reducing cognitive fatigue and preventing visual wandering.

By customizing these visual properties, readers can transform reading from an effort of visual coordination into a direct channel of comprehension and ideas."""
    },
    {
        "id": "sample-2",
        "voice": "en-US-EmmaNeural",
        "text": """Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge."""
    },
    {
        "id": "sample-3",
        "voice": "en-US-GuyNeural",
        "text": """Clean code is code that is easy to understand and easy to change. Software engineering is a social activity; we write code for machines to execute, but we write it primarily for other humans to read, maintain, and build upon. Indeed, research shows that the ratio of time spent reading code versus writing code is over ten to one.

When software developers write code, they must manage cognitive load. A clean architecture manages this load by separating concerns into distinct layers. Each module or class should have a single responsibility—a single reason to change. If a module performs multiple tasks, it becomes coupled, making it difficult to comprehend and prone to unexpected side-effects during modification.

To improve code readability, engineers should follow clean formatting conventions:
- Use meaningful, descriptive names for functions and variables.
- Write short, focused functions that perform one operation.
- Implement consistent spacing and indentation to reflect scope.
- Write helpful comments that explain the "why" rather than the "what".

Adhering to these clean code principles ensures that codebases remain maintainable, scalable, and accessible to teams of all sizes, minimizing developer friction and technical debt."""
    }
]

async def generate_sample(sample_id, voice, text, target_dir):
    audio_path = os.path.join(target_dir, f"{sample_id}.mp3")
    json_path = os.path.join(target_dir, f"{sample_id}.json")
    
    print(f"Generating voice for {sample_id} ({voice})...")
    communicate = edge_tts.Communicate(text, voice, boundary="WordBoundary")
    words_data = []

    with open(audio_path, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                offset_ticks = chunk.get("offset")
                duration_ticks = chunk.get("duration")
                word_text = chunk.get("text")
                
                offset_ms = offset_ticks / 10000
                duration_ms = duration_ticks / 10000
                
                words_data.append({
                    "word": word_text,
                    "start_time_ms": offset_ms,
                    "duration_ms": duration_ms,
                    "end_time_ms": offset_ms + duration_ms
                })

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(words_data, f, indent=2, ensure_ascii=False)

    print(f"Finished {sample_id}: {len(words_data)} words saved.")

async def main():
    target_dir = os.path.abspath("C:/Users/215ba/dyslexia-reader/public/audio")
    os.makedirs(target_dir, exist_ok=True)
    
    for sample in SAMPLES:
        await generate_sample(sample["id"], sample["voice"], sample["text"], target_dir)
        # Add a small delay between requests
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
