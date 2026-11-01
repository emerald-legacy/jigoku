describe('Crisis Breaker', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['crisis-breaker', 'matsu-berserker', 'border-rider']
                },
                player2: {
                    fate: 5,
                    inPlay: ['akodo-toturi', 'brash-samurai'],
                    hand: ['mirumoto-s-fury']
                }
            });

            this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.rider = this.player1.findCardByName('border-rider');

            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.fury = this.player2.findCardByName('mirumoto-s-fury');
        });

        describe('when the opponent counts more military skill', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    defenders: [this.toturi]
                });
                this.player2.pass();
            });

            it('should ready a Berserker you control and move it to the conflict', function() {
                this.berserker.bowed = true; // setup: a bowed Berserker at home
                this.player1.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Crisis Breaker');
                expect(this.player1).toBeAbleToSelect(this.berserker);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
                expect(this.player1).not.toBeAbleToSelect(this.rider);
                expect(this.player1).not.toBeAbleToSelect(this.toturi);
                this.player1.clickCard(this.berserker);
                expect(this.berserker.bowed).toBe(false);
                expect(this.berserker.isAttacking()).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(5);
                expect(this.getChatLogs(5)).toContain('player1 uses Crisis Breaker to ready Matsu Berserker and move it into the conflict');
            });

            // ruling #297: moving a ready Berserker is enough
            it('should move a ready Berserker at home to the conflict', function() {
                this.player1.clickCard(this.crisisBreaker);
                this.player1.clickCard(this.crisisBreaker);
                expect(this.crisisBreaker.isAttacking()).toBe(true);
                expect(this.crisisBreaker.bowed).toBe(false);
                expect(this.game.currentConflict.attackerSkill).toBe(5);
            });
        });

        // ruling #297: readying a bowed participating Berserker is enough
        it('should ready a bowed participating Berserker', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rider, this.berserker],
                defenders: [this.toturi]
            });
            this.player2.clickCard(this.fury);
            this.player2.clickCard(this.berserker);
            expect(this.berserker.bowed).toBe(true);
            expect(this.berserker.isAttacking()).toBe(true);
            this.player1.clickCard(this.crisisBreaker);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.bowed).toBe(false);
            expect(this.berserker.isAttacking()).toBe(true);
            expect(this.game.currentConflict.attackerSkill).toBe(5);
        });

        it('should not be usable when the opponent does not count more military skill', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rider],
                defenders: [this.brash]
            });
            this.player2.pass();
            expect(this.game.currentConflict.attackerSkill).toBe(2);
            expect(this.game.currentConflict.defenderSkill).toBe(2);
            this.player1.clickCard(this.crisisBreaker);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.isParticipating()).toBe(false);
            expect(this.crisisBreaker.isParticipating()).toBe(false);
        });

        // ruling #160: the Imperial Favor counts toward the current skill
        it('should count the opponent\'s Imperial Favor', function() {
            this.player2.player.imperialFavor = 'military';
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rider],
                defenders: [this.brash]
            });
            this.player2.pass();
            expect(this.game.currentConflict.defenderSkill).toBe(3);
            this.player1.clickCard(this.crisisBreaker);
            expect(this.player1).toHavePrompt('Crisis Breaker');
            this.player1.clickCard(this.berserker);
            expect(this.berserker.isAttacking()).toBe(true);
        });

        it('should not be usable during a political conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.rider],
                defenders: [this.toturi]
            });
            this.player2.pass();
            expect(this.game.currentConflict.defenderSkill).toBe(3);
            this.player1.clickCard(this.crisisBreaker);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.isParticipating()).toBe(false);
        });
    });
});
