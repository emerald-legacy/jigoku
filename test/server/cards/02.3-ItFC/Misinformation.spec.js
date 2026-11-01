describe('Misinformation', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['border-rider', 'ide-negotiator'],
                    hand: ['misinformation', 'contingency-plan']
                },
                player2: {
                    inPlay: ['brash-samurai', 'doji-whisperer'],
                    dynastyDeck: ['matsu-berserker'],
                    hand: ['charge']
                }
            });

            this.rider = this.player1.findCardByName('border-rider');
            this.negotiator = this.player1.findCardByName('ide-negotiator');
            this.misinformation = this.player1.findCardByName('misinformation');
            this.contingencyPlan = this.player1.findCardByName('contingency-plan');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.charge = this.player2.findCardByName('charge');
            this.berserker = this.player2.placeCardInProvince('matsu-berserker', 'province 2');
            this.berserker.facedown = false;

            this.goToConflict = () => {
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    defenders: [this.brash]
                });
                this.player2.pass();
            };
        });

        it('should give each participating opposing character -1/-1 if your bid is at least 2 higher', function() {
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('Pass');
            this.goToConflict();
            this.player1.clickCard(this.misinformation);
            expect(this.misinformation.location).toBe('conflict discard pile');
            expect(this.brash.getMilitarySkill()).toBe(1);
            expect(this.brash.getPoliticalSkill()).toBe(0);
            expect(this.whisperer.getPoliticalSkill()).toBe(3);
            expect(this.rider.getMilitarySkill()).toBe(2);
            expect(this.rider.getPoliticalSkill()).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 plays Misinformation to give all opposing characters -1military/-1political');
        });

        it('should last until the end of the conflict', function() {
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('Pass');
            this.goToConflict();
            this.player1.clickCard(this.misinformation);
            expect(this.brash.getMilitarySkill()).toBe(1);
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 2 vs 1');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.game.currentConflict).toBe(null);
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.brash.getPoliticalSkill()).toBe(1);
        });

        it('should not be playable if your bid is only 1 higher', function() {
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('Pass');
            this.goToConflict();
            this.player1.clickCard(this.misinformation);
            expect(this.misinformation.location).toBe('hand');
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        // ruling #263: characters entering the conflict afterwards are not affected
        it('should not affect characters that join the conflict later', function() {
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('Pass');
            this.goToConflict();
            this.player1.clickCard(this.misinformation);
            this.player2.clickCard(this.charge);
            this.player2.clickCard(this.berserker);
            expect(this.berserker.isParticipating()).toBe(true);
            expect(this.berserker.getMilitarySkill()).toBe(3);
            expect(this.brash.getMilitarySkill()).toBe(1);
        });

        // rulings #262, #817: modifying the bid value does not change the dial, which is what it reads
        it('should read the dial, not a modified bid value', function() {
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');
            this.player1.clickCard(this.contingencyPlan);
            this.player1.clickPrompt('Increase honor bid');
            expect(this.player1.player.honorBid).toBe(3);
            expect(this.player1.player.showBid).toBe(2);
            this.player1.clickPrompt('Pass');
            this.goToConflict();
            this.player1.clickCard(this.misinformation);
            expect(this.misinformation.location).toBe('hand');
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        // ruling #561: Ide Negotiator changes the dial itself
        it('should count a dial changed by Ide Negotiator', function() {
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');
            this.player1.clickCard(this.negotiator);
            this.player1.clickPrompt('Increase bid by 1');
            expect(this.player1.player.showBid).toBe(3);
            this.player1.clickPrompt('Pass');
            this.goToConflict();
            this.player1.clickCard(this.misinformation);
            expect(this.misinformation.location).toBe('conflict discard pile');
            expect(this.brash.getMilitarySkill()).toBe(1);
        });
    });
});
