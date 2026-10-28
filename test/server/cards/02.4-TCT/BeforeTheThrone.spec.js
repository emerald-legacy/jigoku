describe('Before the Throne', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['doji-challenger', 'kakita-kaezin']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-whisperer'],
                    provinces: ['before-the-throne', 'shameful-display']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kaezin = this.player1.findCardByName('kakita-kaezin');
            this.throne = this.player2.findCardByName('before-the-throne', 'province 1');
            this.display = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
        });

        it('takes 2 honor from the opponent when it is broken', function() {
            this.initiateConflict({
                type: 'military',
                province: this.throne,
                attackers: [this.challenger, this.kaezin],
                defenders: ['doji-whisperer']
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 6 vs 0');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.throne);
            this.player2.clickCard(this.throne);
            expect(this.player2.honor).toBe(12);
            expect(this.player1.honor).toBe(8);
            expect(this.throne.isBroken).toBe(true);
            expect(this.getChatLogs(10)).toContain('player2 uses Before the Throne to take 2 honor from player1');
        });

        it('does not trigger when another province is broken', function() {
            this.initiateConflict({
                type: 'military',
                province: this.display,
                attackers: [this.challenger, this.kaezin],
                defenders: ['doji-whisperer']
            });
            this.noMoreActions();
            expect(this.display.isBroken).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.honor).toBe(10);
            expect(this.player1.honor).toBe(10);
        });
    });
});

describe('Before the Throne during setup', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'setup',
                player1: {
                    provinces: ['before-the-throne', 'shameful-display']
                },
                skipAutoSetup: true
            });
            this.throne = this.player1.findCardByName('before-the-throne');
            this.display = this.player1.findCardByName('shameful-display');
            this.selectFirstPlayer(this.player1);
        });

        it('cannot be the stronghold province', function() {
            expect(this.player1).toHavePrompt('Select stronghold province');
            expect(this.player1).toBeAbleToSelect(this.display);
            expect(this.player1).not.toBeAbleToSelect(this.throne);
        });
    });
});
