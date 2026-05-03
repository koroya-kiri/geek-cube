import { describe, it, expect } from 'vitest'
import { toolCategories, allTools, toolRoutes } from '../utils/tools'

describe('Tool registration integrity', () => {
  it('every tool should have a unique id', () => {
    const ids = allTools.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every tool should have a unique path', () => {
    const paths = allTools.map(t => t.path)
    expect(new Set(paths).size).toBe(paths.length)
  })
  it('every tool path should start with /tools/', () => {
    for (const tool of allTools) { expect(tool.path).toMatch(/^\/tools\//) }
  })
  it('toolRoutes should map every id to its path', () => {
    for (const tool of allTools) { expect(toolRoutes[tool.id]).toBe(tool.path) }
  })
  it('every category should have at least one tool', () => {
    for (const cat of toolCategories) { expect(cat.tools.length).toBeGreaterThan(0) }
  })
  it('every category should have a unique id', () => {
    const ids = toolCategories.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every tool should have a non-empty name', () => {
    for (const tool of allTools) { expect(tool.name.length).toBeGreaterThan(0) }
  })
  it('every tool should have a non-empty description', () => {
    for (const tool of allTools) { expect(tool.description.length).toBeGreaterThan(0) }
  })
  it('every tool should have an icon', () => {
    for (const tool of allTools) { expect(tool.icon).toBeDefined() }
  })
  it('every tool should have a color', () => {
    for (const tool of allTools) { expect(tool.color).toBeDefined(); expect(tool.color).toMatch(/^#[0-9a-fA-F]{6}$/) }
  })
  it('tool count should be >= 65 (current)', () => {
    expect(allTools.length).toBeGreaterThanOrEqual(65)
  })
  it('category count should be >= 11 (current)', () => {
    expect(toolCategories.length).toBeGreaterThanOrEqual(11)
  })
  it('toolRoutes should have same count as allTools', () => {
    expect(Object.keys(toolRoutes).length).toBe(allTools.length)
  })
})

describe('Category structure', () => {
  it('PDF 工具 should have at least 6 tools', () => {
    const cat = toolCategories.find(c => c.id === 'pdf')
    expect(cat).toBeDefined(); expect(cat!.tools.length).toBeGreaterThanOrEqual(6)
  })
  it('加密工具 should have at least 10 tools', () => {
    const cat = toolCategories.find(c => c.id === 'crypto')
    expect(cat).toBeDefined(); expect(cat!.tools.length).toBeGreaterThanOrEqual(10)
  })
  it('编解码工具 should have at least 8 tools', () => {
    const cat = toolCategories.find(c => c.id === 'codec')
    expect(cat).toBeDefined(); expect(cat!.tools.length).toBeGreaterThanOrEqual(8)
  })
  it('格式化工具 should have at least 9 tools', () => {
    const cat = toolCategories.find(c => c.id === 'format')
    expect(cat).toBeDefined(); expect(cat!.tools.length).toBeGreaterThanOrEqual(9)
  })
  it('生成器工具 should have at least 10 tools', () => {
    const cat = toolCategories.find(c => c.id === 'generator')
    expect(cat).toBeDefined(); expect(cat!.tools.length).toBeGreaterThanOrEqual(10)
  })
})
