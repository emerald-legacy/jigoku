describe('Shiba Yōjimbō', function() {
    integration(function() {
        describe('Shiba Yōjimbō during a political conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-yojimbo', 'adept-of-the-waves', 'doji-whisperer'],
                        hand: ['assassination']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['vice-proprietor', 'iuchi-wayfinder', 'kakita-asami'],
                        hand: ['assassination', 'court-games']
                    }
                });
                this.yojimbo = this.player1.findCardByName('shiba-yojimbo');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.p1Assassination = this.player1.findCardByName('assassination');
                this.proprietor = this.player2.findCardByName('vice-proprietor');
                this.wayfinder = this.player2.findCardByName('iuchi-wayfinder');
                this.asami = this.player2.findCardByName('kakita-asami');
                this.p2Assassination = this.player2.findCardByName('assassination');
                this.courtGames = this.player2.findCardByName('court-games');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    province: this.shamefulDisplay,
                    attackers: [this.adept, this.whisperer],
                    defenders: [this.proprietor, this.wayfinder]
                });
            });

            it('cancels the effects of an opponent\'s triggered ability that targets a Shugenja you control', function() {
                this.player2.clickCard(this.p2Assassination);
                this.player2.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                this.player1.clickCard(this.yojimbo);
                expect(this.adept.location).toBe('play area');
                expect(this.p2Assassination.location).toBe('conflict discard pile');
                expect(this.player2.honor).toBe(8);
                expect(this.getChatLogs(5)).toContain('player1 uses Shiba Yōjimbō to cancel the effects of Assassination');
            });

            it('does not trigger for an ability that targets a character that is not a Shugenja', function() {
                this.player2.clickCard(this.p2Assassination);
                this.player2.clickCard(this.whisperer);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.whisperer.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('does not trigger for an ability that targets a Shugenja your opponent controls', function() {
                this.player1.player.optionSettings.cancelOwnAbilities = true;
                this.player2.pass();
                this.player1.clickCard(this.p1Assassination);
                this.player1.clickCard(this.wayfinder);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.wayfinder.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('can cancel your own triggered ability that targets a Shugenja you control', function() {
                this.player1.player.optionSettings.cancelOwnAbilities = true;
                this.player2.pass();
                this.player1.clickCard(this.p1Assassination);
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                this.player1.clickCard(this.yojimbo);
                expect(this.adept.location).toBe('play area');
                expect(this.p1Assassination.location).toBe('conflict discard pile');
            });

            it('cancels every effect of an ability that also targets other characters (ruling #220)', function() {
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.adept);
                this.player2.clickCard(this.proprietor);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                this.player1.clickCard(this.yojimbo);
                expect(this.adept.isHonored).toBe(false);
                expect(this.adept.isDishonored).toBe(false);
                expect(this.proprietor.isHonored).toBe(false);
                expect(this.proprietor.isDishonored).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('cancels an opponent\'s ability for which you chose your Shugenja as the target (ruling #1048)', function() {
                this.player2.clickCard(this.proprietor);
                expect(this.player1).toHavePrompt('Vice Proprietor');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                this.player1.clickCard(this.yojimbo);
                expect(this.adept.bowed).toBe(false);
                expect(this.proprietor.isDishonored).toBe(true);
            });

            it('cannot cancel an ability whose target is chosen only when its effects resolve (ruling #103)', function() {
                this.player2.clickCard(this.courtGames);
                this.player2.clickPrompt('Dishonor an opposing character');
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.adept);
                expect(this.adept.isDishonored).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Shiba Yōjimbō and Shosuro Actress', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-yojimbo', 'doji-whisperer'],
                        dynastyDiscard: ['adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['shosuro-actress']
                    }
                });
                this.yojimbo = this.player1.findCardByName('shiba-yojimbo');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.adept = this.player1.findCardByName('adept-of-the-waves', 'dynasty discard pile');
                this.actress = this.player2.findCardByName('shosuro-actress');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    attackers: [this.whisperer],
                    defenders: []
                });
            });

            it('cannot cancel an ability that targets a Shugenja in a discard pile (ruling #380)', function() {
                this.player2.clickCard(this.actress);
                expect(this.player2).toBeAbleToSelect(this.adept);
                this.player2.clickCard(this.adept);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.adept.location).toBe('play area');
                expect(this.adept.controller).toBe(this.player2.player);
                expect(this.adept.isDefending()).toBe(true);
            });
        });
    });
});
