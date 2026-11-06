describe('Matsu Nobuiko', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-nobuiko', 'doji-whisperer'],
                    hand: ['way-of-the-scorpion']
                },
                player2: {
                    inPlay: ['brash-samurai', 'matsu-berserker', 'kitsu-spiritcaller'],
                    hand: ['way-of-the-scorpion'],
                    provinces: { 'province 2': { provinceCard: 'foregate-village' } }
                }
            });
            this.nobuiko = this.player1.findCardByName('matsu-nobuiko');
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.ownWayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.brashSamurai = this.player2.findCardByName('brash-samurai');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.kitsuSpiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
            this.foregateVillage = this.player2.findCardByName('foregate-village');
        });

        describe('when an Action ability would resolve while it is participating', function () {
            beforeEach(function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.nobuiko, this.dojiWhisperer],
                    defenders: [this.brashSamurai]
                });
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.nobuiko);
            });

            it('should offer to interrupt', function () {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.nobuiko);
            });

            it('should let the opponent choose a participating character of theirs to duel', function () {
                this.player1.clickCard(this.nobuiko);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.brashSamurai);
                expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).not.toBeAbleToSelect(this.nobuiko);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
            });

            it('should cancel the effects if it wins the duel', function () {
                this.player1.clickCard(this.nobuiko);
                this.player2.clickCard(this.brashSamurai);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.nobuiko.isDishonored).toBe(false);
                expect(this.wayOfTheScorpion.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not cancel the effects if it loses the duel', function () {
                this.player1.clickCard(this.nobuiko);
                this.player2.clickCard(this.brashSamurai);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.nobuiko.isDishonored).toBe(true);
            });

            it('should not cancel the effects if the duel is a draw', function () {
                this.player1.clickCard(this.nobuiko);
                this.player2.clickCard(this.brashSamurai);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('4');
                expect(this.nobuiko.isDishonored).toBe(true);
            });

            it('should let the effects resolve if not triggered', function () {
                this.player1.clickPrompt('Pass');
                expect(this.nobuiko.isDishonored).toBe(true);
            });
        });

        it('should interrupt an Action ability on a character', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.nobuiko],
                defenders: [this.brashSamurai]
            });
            this.player2.clickCard(this.brashSamurai);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.nobuiko);
            this.player1.clickCard(this.nobuiko);
            this.player2.clickCard(this.brashSamurai);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.brashSamurai.isHonored).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should interrupt its controller\'s own Action abilities too', function () {
            this.player1.player.optionSettings.cancelOwnAbilities = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.nobuiko],
                defenders: [this.brashSamurai]
            });
            this.player2.pass();
            this.player1.clickCard(this.ownWayOfTheScorpion);
            this.player1.clickCard(this.brashSamurai);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.nobuiko);
        });

        it('should not trigger while it is not participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dojiWhisperer],
                defenders: [this.brashSamurai]
            });
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.dojiWhisperer);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.dojiWhisperer.isDishonored).toBe(true);
        });

        it('should not trigger on a Reaction ability', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.foregateVillage,
                attackers: [this.nobuiko]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.foregateVillage);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.game.currentConflict.conflictType).toBe('political');
        });

        it('should be honored after winning a conflict (Pride)', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.nobuiko],
                defenders: []
            });
            this.noMoreActions();
            expect(this.nobuiko.isHonored).toBe(true);
        });

        it('should be dishonored after losing a conflict (Pride)', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.nobuiko],
                defenders: [this.brashSamurai, this.matsuBerserker, this.kitsuSpiritcaller]
            });
            this.noMoreActions();
            expect(this.nobuiko.isDishonored).toBe(true);
        });
    });
});
