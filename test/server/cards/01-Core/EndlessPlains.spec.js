describe('Endless Plains', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'matsu-berserker', 'kakita-yoshi']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    provinces: ['endless-plains']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.endlessPlains = this.player2.findCardByName('endless-plains');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.dynastyCard = this.player2.player.getDynastyCardInProvince('province 1');
            this.noMoreActions();
        });

        it('breaks itself and the opponent chooses an attacking character to discard', function() {
            this.initiateConflict({
                type: 'military',
                province: this.endlessPlains,
                attackers: [this.brash, this.berserker]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.endlessPlains);
            this.player2.clickCard(this.endlessPlains);
            expect(this.endlessPlains.isBroken).toBe(true);
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Choose a character to discard');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.location).toBe('dynasty discard pile');
            expect(this.brash.isAttacking()).toBe(true);
        });

        it('lets the attacking player discard the card in the broken province (ruling #41)', function() {
            this.initiateConflict({
                type: 'military',
                province: this.endlessPlains,
                attackers: [this.brash, this.berserker]
            });
            this.player2.clickCard(this.endlessPlains);
            expect(this.player1).toHavePromptButton('Yes');
            this.player1.clickPrompt('Yes');
            expect(this.dynastyCard.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Choose a character to discard');
        });

        it('does not end the conflict when the only attacker is discarded (ruling #40)', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: this.endlessPlains,
                attackers: [this.brash]
            });
            this.player2.clickCard(this.endlessPlains);
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.brash);
            expect(this.brash.location).toBe('dynasty discard pile');
            expect(this.player2).toHavePrompt('Choose defenders');
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');
            expect(this.whisperer.isDefending()).toBe(true);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('There is no winner or loser for this conflict because both sides have 0 skill');
            expect(this.game.rings.air.claimed).toBe(false);
        });

        it('does not trigger when the attack is declared against another province', function() {
            this.endlessPlains.facedown = false;
            this.initiateConflict({
                type: 'military',
                province: this.otherProvince,
                attackers: [this.brash, this.berserker]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.endlessPlains);
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.endlessPlains.isBroken).toBe(false);
        });
    });
});
