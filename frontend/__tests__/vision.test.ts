import { identifyIngredients } from "../src/services/vision";

global.fetch = jest.fn()

beforeEach(() => {
    jest.clearAllMocks()
})

it("should return label and coordinates", async () => {
    (fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
            candidates: [{
                content: {parts: [{ text: '[{"box_2d": [100, 200, 500, 600], "label": "apple"}]'}]}
            }]
        })
    })
    const result = await identifyIngredients("asldkfvsladkfjn")
    expect(result[0].label).toBe("apple")
    expect(result[0].box_2d).toEqual([100, 200, 500, 600])
    expect(result.length).toBe(1)
})

it("returns [] on error", async () => {
    (fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
            candidates: [{
                content: {parts: [{ text: 'no ingredients found'}]}
            }]
        })
    })
    const result = await identifyIngredients("asldkfvsladkfjn")
    expect(result).toEqual([])
})
