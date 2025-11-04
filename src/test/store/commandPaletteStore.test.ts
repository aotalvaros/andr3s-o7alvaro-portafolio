import { CommandItem, useCommandPaletteStore } from "@/store/commandPaletteStore";
import { act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("CommandPaletteStore", () => {
    beforeEach(() => {
        // Reset the store state before each test
        useCommandPaletteStore.setState({
            commands: [],
            isOpen: false,
            search: "",
            selectedIndex: 0,
        });
        vi.clearAllMocks();
    });

    describe("Initial State", () => {
        it("should have correct default state values", () => {
            const state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(false);
            expect(state.search).toBe("");
            expect(state.selectedIndex).toBe(0);
            expect(state.commands).toEqual([]);
        });
    });

    describe("setOpen", () => {
        it("should open the command palette", () => {
            const { setOpen } = useCommandPaletteStore.getState();
            
            act(() => {
                setOpen(true);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(true);
        });

        it("should close the command palette", () => {
            const { setOpen } = useCommandPaletteStore.getState();
            
            act(() => {
                setOpen(true);
                setOpen(false);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(false);
        });

        it("should reset search and selectedIndex when closing", () => {
            const { setOpen, setSearch, setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSearch("test search");
                setSelectedIndex(3);
                setOpen(true);
            });
            
            let state = useCommandPaletteStore.getState();
            expect(state.search).toBe("test search");
            expect(state.selectedIndex).toBe(3);
            
            act(() => {
                setOpen(false);
            });
            
            state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(false);
            expect(state.search).toBe("");
            expect(state.selectedIndex).toBe(0);
        });

        it("should not reset search and selectedIndex when opening", () => {
            const { setOpen, setSearch, setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSearch("test search");
                setSelectedIndex(2);
                setOpen(true);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.search).toBe("test search");
            expect(state.selectedIndex).toBe(2);
            expect(state.isOpen).toBe(true);
        });
    });

    describe("setSearch", () => {
        it("should set search term and reset selectedIndex", () => {
            const { setSearch, setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSelectedIndex(5);
                setSearch("test");
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.search).toBe("test");
            expect(state.selectedIndex).toBe(0);
        });

        it("should handle empty search term", () => {
            const { setSearch } = useCommandPaletteStore.getState();
            
            act(() => {
                setSearch("");
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.search).toBe("");
            expect(state.selectedIndex).toBe(0);
        });

        it("should handle special characters in search", () => {
            const { setSearch } = useCommandPaletteStore.getState();
            
            act(() => {
                setSearch("test@#$%^&*()");
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.search).toBe("test@#$%^&*()");
        });
    });

    describe("setSelectedIndex", () => {
        it("should set selectedIndex correctly", () => {
            const { setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSelectedIndex(2);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.selectedIndex).toBe(2);
        });

        it("should handle negative selectedIndex", () => {
            const { setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSelectedIndex(-1);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.selectedIndex).toBe(-1);
        });

        it("should handle zero selectedIndex", () => {
            const { setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSelectedIndex(0);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.selectedIndex).toBe(0);
        });
    });

    describe("registerCommand", () => {
        it("should register a new command", () => {
            const { registerCommand } = useCommandPaletteStore.getState();
            const mockAction = vi.fn();
            const command: CommandItem = {
                id: "test",
                label: "Test Command",
                description: "A command for testing",
                action: mockAction,
                category: "actions",
                priority: 1,
                icon: null,
                keywords: ["test", "command"]
            };
            
            act(() => {
                registerCommand(command);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(1);
            expect(state.commands[0]).toEqual(command);
        });

        it("should replace existing command with same id", () => {
            const { registerCommand } = useCommandPaletteStore.getState();
            const mockAction1 = vi.fn();
            const mockAction2 = vi.fn();
            
            const command1: CommandItem = {
                id: "test",
                label: "Test Command 1",
                action: mockAction1,
                category: "actions",
                priority: 1,
                icon: null
            };
            
            const command2: CommandItem = {
                id: "test",
                label: "Test Command 2",
                action: mockAction2,
                category: "navigation",
                priority: 2,
                icon: null
            };
            
            act(() => {
                registerCommand(command1);
                registerCommand(command2);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(1);
            expect(state.commands[0]).toEqual(command2);
            expect(state.commands[0].label).toBe("Test Command 2");
        });

        it("should sort commands by priority (descending)", () => {
            const { registerCommand } = useCommandPaletteStore.getState();
            
            const lowPriority: CommandItem = {
                id: "low",
                label: "Low Priority",
                action: vi.fn(),
                category: "actions",
                priority: 1,
                icon: null
            };
            
            const highPriority: CommandItem = {
                id: "high",
                label: "High Priority",
                action: vi.fn(),
                category: "actions",
                priority: 10,
                icon: null
            };
            
            const mediumPriority: CommandItem = {
                id: "medium",
                label: "Medium Priority",
                action: vi.fn(),
                category: "actions",
                priority: 5,
                icon: null
            };
            
            act(() => {
                registerCommand(lowPriority);
                registerCommand(highPriority);
                registerCommand(mediumPriority);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(3);
            expect(state.commands[0].id).toBe("high");
            expect(state.commands[1].id).toBe("medium");
            expect(state.commands[2].id).toBe("low");
        });

        it("should handle commands without priority", () => {
            const { registerCommand } = useCommandPaletteStore.getState();
            
            const withPriority: CommandItem = {
                id: "priority",
                label: "With Priority",
                action: vi.fn(),
                category: "actions",
                priority: 5,
                icon: null
            };
            
            const withoutPriority: CommandItem = {
                id: "no-priority",
                label: "Without Priority",
                action: vi.fn(),
                category: "actions",
                icon: null
            };
            
            act(() => {
                registerCommand(withoutPriority);
                registerCommand(withPriority);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands[0].id).toBe("priority");
            expect(state.commands[1].id).toBe("no-priority");
        });
    });

    describe("unregisterCommand", () => {
        it("should remove existing command", () => {
            const { registerCommand, unregisterCommand } = useCommandPaletteStore.getState();
            const command: CommandItem = {
                id: "test",
                label: "Test Command",
                action: vi.fn(),
                category: "actions",
                icon: null
            };
            
            act(() => {
                registerCommand(command);
            });
            
            let state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(1);
            
            act(() => {
                unregisterCommand("test");
            });
            
            state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(0);
        });

        it("should handle unregistering non-existent command", () => {
            const { unregisterCommand } = useCommandPaletteStore.getState();
            
            act(() => {
                unregisterCommand("non-existent");
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(0);
        });

        it("should only remove specified command", () => {
            const { registerCommand, unregisterCommand } = useCommandPaletteStore.getState();
            
            const command1: CommandItem = {
                id: "test1",
                label: "Test Command 1",
                action: vi.fn(),
                category: "actions",
                icon: null
            };
            
            const command2: CommandItem = {
                id: "test2",
                label: "Test Command 2",
                action: vi.fn(),
                category: "actions",
                icon: null
            };
            
            act(() => {
                registerCommand(command1);
                registerCommand(command2);
            });
            
            let state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(2);
            
            act(() => {
                unregisterCommand("test1");
            });
            
            state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(1);
            expect(state.commands[0].id).toBe("test2");
        });
    });

    describe("executeSelectedCommand", () => {
        it("should execute selected command and reset state", () => {
            const { registerCommand, executeSelectedCommand, setSelectedIndex } = useCommandPaletteStore.getState();
            const mockAction = vi.fn();
            
            const command: CommandItem = {
                id: "test",
                label: "Test Command",
                action: mockAction,
                category: "actions",
                icon: null
            };
            
            act(() => {
                registerCommand(command);
                setSelectedIndex(0);
                executeSelectedCommand();
            });
            
            expect(mockAction).toHaveBeenCalledTimes(1);
            
            const state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(false);
            expect(state.search).toBe("");
            expect(state.selectedIndex).toBe(0);
        });

        it("should not execute if no command at selected index", () => {
            const { executeSelectedCommand, setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setSelectedIndex(5); // Index that doesn't exist
                executeSelectedCommand();
            });
            
            const state = useCommandPaletteStore.getState();
            // State should remain unchanged
            expect(state.isOpen).toBe(false);
            expect(state.search).toBe("");
            expect(state.selectedIndex).toBe(5);
        });

        it("should work with filtered commands", () => {
            const { registerCommand, executeSelectedCommand, setSearch, setSelectedIndex } = useCommandPaletteStore.getState();
            
            const mockAction1 = vi.fn();
            const mockAction2 = vi.fn();
            
            const command1: CommandItem = {
                id: "apple",
                label: "Apple Command",
                action: mockAction1,
                category: "actions",
                icon: null
            };
            
            const command2: CommandItem = {
                id: "banana",
                label: "Banana Command",
                action: mockAction2,
                category: "actions",
                icon: null
            };
            
            act(() => {
                registerCommand(command1);
                registerCommand(command2);
                setSearch("apple"); // This should filter to only show command1
                setSelectedIndex(0); // First (and only) filtered command
                executeSelectedCommand();
            });
            
            expect(mockAction1).toHaveBeenCalledTimes(1);
            expect(mockAction2).not.toHaveBeenCalled();
        });

        it("should handle command execution with keywords filtering", () => {
            const { registerCommand, executeSelectedCommand, setSearch, setSelectedIndex } = useCommandPaletteStore.getState();
            
            const mockAction = vi.fn();
            const command: CommandItem = {
                id: "test",
                label: "Navigation Command",
                action: mockAction,
                category: "actions",
                keywords: ["nav", "navigate", "go"],
                icon: null
            };
            
            act(() => {
                registerCommand(command);
                setSearch("nav"); // Should match via keywords
                setSelectedIndex(0);
                executeSelectedCommand();
            });
            
            expect(mockAction).toHaveBeenCalledTimes(1);
        });
    });

    describe("resetState", () => {
        it("should reset all state values", () => {
            const { setOpen, setSearch, setSelectedIndex, resetState } = useCommandPaletteStore.getState();
            
            act(() => {
                setOpen(true);
                setSearch("test search");
                setSelectedIndex(5);
            });
            
            let state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(true);
            expect(state.search).toBe("test search");
            expect(state.selectedIndex).toBe(5);
            
            act(() => {
                resetState();
            });
            
            state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(false);
            expect(state.search).toBe("");
            expect(state.selectedIndex).toBe(0);
        });
    });

    describe("filterCommands utility", () => {
        beforeEach(() => {
            const { registerCommand } = useCommandPaletteStore.getState();
            
            const commands: CommandItem[] = [
                {
                    id: "home",
                    label: "Go Home",
                    description: "Navigate to home page",
                    action: vi.fn(),
                    category: "navigation",
                    keywords: ["home", "start", "main"],
                    icon: null
                },
                {
                    id: "about",
                    label: "About Page",
                    description: "Learn more about us",
                    action: vi.fn(),
                    category: "navigation",
                    keywords: ["info", "about"],
                    icon: null
                },
                {
                    id: "contact",
                    label: "Contact Us",
                    description: "Get in touch",
                    action: vi.fn(),
                    category: "actions",
                    keywords: ["contact", "email", "support"],
                    icon: null
                }
            ];
            
            act(() => {
                commands.forEach(registerCommand);
            });
        });

        it("should filter by label", () => {
            const { setSearch, executeSelectedCommand, setSelectedIndex } = useCommandPaletteStore.getState();
            const contactAction = useCommandPaletteStore.getState().commands.find(cmd => cmd.id === "contact")?.action as ReturnType<typeof vi.fn>;
            
            act(() => {
                setSearch("contact");
                setSelectedIndex(0);
                executeSelectedCommand();
            });
            
            expect(contactAction).toHaveBeenCalledTimes(1);
        });

        it("should filter by description", () => {
            const { setSearch, executeSelectedCommand, setSelectedIndex } = useCommandPaletteStore.getState();
            const homeAction = useCommandPaletteStore.getState().commands.find(cmd => cmd.id === "home")?.action as ReturnType<typeof vi.fn>;
            
            act(() => {
                setSearch("Navigate");
                setSelectedIndex(0);
                executeSelectedCommand();
            });
            
            expect(homeAction).toHaveBeenCalledTimes(1);
        });

        it("should filter by keywords", () => {
            const { setSearch, executeSelectedCommand,setSelectedIndex } = useCommandPaletteStore.getState();
            const contactAction = useCommandPaletteStore.getState().commands.find(cmd => cmd.id === "contact")?.action as ReturnType<typeof vi.fn>;
            
            act(() => {
                setSearch("support");
                setSelectedIndex(0);
                executeSelectedCommand();
            });
            
            expect(contactAction).toHaveBeenCalledTimes(1);
        });

        it("should be case insensitive", () => {
            const { setSearch, executeSelectedCommand,setSelectedIndex } = useCommandPaletteStore.getState();
            const homeAction = useCommandPaletteStore.getState().commands.find(cmd => cmd.id === "home")?.action as ReturnType<typeof vi.fn>;
            
            act(() => {
                setSearch("HOME");
                setSelectedIndex(0);
                executeSelectedCommand();
            });
            
            expect(homeAction).toHaveBeenCalledTimes(1);
        });

        it("should return all commands when search is empty", () => {
            const { setSearch } = useCommandPaletteStore.getState();
            
            act(() => {
                setSearch("");
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(3);
        });

        it("should return empty array when no matches", () => {
            const { setSearch, executeSelectedCommand } = useCommandPaletteStore.getState();
            
            act(() => {
                setSearch("nonexistent");
                executeSelectedCommand(); // Should not execute anything
            });
            
            // No actions should be called
            const allActions = useCommandPaletteStore.getState().commands.map(cmd => cmd.action);
            allActions.forEach(action => {
                expect(action as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
            });
        });
    });

    describe("Edge Cases", () => {
        it("should handle multiple rapid state changes", () => {
            const { setOpen, setSearch, setSelectedIndex } = useCommandPaletteStore.getState();
            
            act(() => {
                setOpen(true);
                setSearch("test");
                setSelectedIndex(1);
                setOpen(false);
                setOpen(true);
                setSearch("another");
                setSelectedIndex(2);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.isOpen).toBe(true);
            expect(state.search).toBe("another");
            expect(state.selectedIndex).toBe(2);
        });

        it("should handle command with undefined optional properties", () => {
            const { registerCommand } = useCommandPaletteStore.getState();
            
            const minimalCommand: CommandItem = {
                id: "minimal",
                label: "Minimal Command",
                action: vi.fn(),
                category: "actions",
                icon: null
            };
            
            act(() => {
                registerCommand(minimalCommand);
            });
            
            const state = useCommandPaletteStore.getState();
            expect(state.commands).toHaveLength(1);
            expect(state.commands[0]).toEqual(minimalCommand);
        });
    });
});