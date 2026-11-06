describe('Utaku Stable Master', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['utaku-stable-master', 'shinjo-outrider', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'matsu-berserker']
                }
            });
            this.stableMaster = this.player1.findCardByName('utaku-stable-master');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.berserker = this.player2.findCardByName('matsu-berserker');
        });

        it('should bow a participating character with equal or lower glory than a participating friendly Cavalry, even from home', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: [this.challenger, this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.stableMaster);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.outrider);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Utaku Stable Master to bow Doji Challenger');
        });

        it('should not be usable without a participating friendly Cavalry character', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.stableMaster);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.challenger.bowed).toBe(false);
        });

        it('should not be usable outside of a conflict', function() {
            this.player1.clickCard(this.stableMaster);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});

describe('Utaku Stable Master with Cavalry on the other side than their controller', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['utaku-stable-master', 'doji-whisperer', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.stableMaster = this.player1.findCardByName('utaku-stable-master');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                attackers: [this.whisperer],
                defenders: [this.scholar]
            });
        });

        it('is not usable when the only participating Cavalry you control is on the enemy side', function() {
            this.player2.pass();
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);
            this.player2.pass();

            this.player1.clickCard(this.stableMaster);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.scholar.bowed).toBe(false);
        });

        it('counts an opponent\'s Cavalry on your side', function() {
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);

            this.player1.clickCard(this.stableMaster);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.scholar);
            this.player1.clickCard(this.scholar);
            expect(this.scholar.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Utaku Stable Master to bow Solemn Scholar');
        });
    });
});
