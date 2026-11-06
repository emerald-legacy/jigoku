describe('Shiba Tetsu', function() {
    integration(function() {
        describe('When playing a spell card', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay:['Shiba Tetsu', 'Keeper Initiate', 'Adept of the Waves'],
                        hand: ['Supernatural Storm', 'Supernatural Storm', 'Supernatural Storm']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['Keeper Initiate', 'Adept of the Waves'],
                    defenders: []
                });

                this.player2.pass(); //Pass priority to player 1
                this.storm1 = this.player1.hand[0];
                this.storm2 = this.player1.hand[1];
                this.shiba = this.player1.findCardByName('Shiba Tetsu', 'play area');
                this.keeper = this.player1.findCardByName('Keeper Initiate', 'play area');

                //Play a spell
                this.player1.clickCard(this.storm1);
                this.player1.clickCard(this.keeper);
            });

            it('should prompt the player for reactions', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
            });

            it('should have Shiba Tetsu as a target', function() {
                expect(this.player1).toBeAbleToSelect(this.shiba);
            });

            describe('when the player activates the reaction', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shiba);
                });

                it('should increase its military skill', function() {
                    expect(this.shiba.militarySkill).toBe(3);
                });

                it('should increase its political skill', function() {
                    expect(this.shiba.politicalSkill).toBe(2);
                });
            });

            describe('when playing additional spells', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shiba);
                    this.player2.pass();
                    this.player1.clickCard(this.storm2);
                    this.player1.clickCard(this.keeper);
                });

                it('should prompt the player again', function() {
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.shiba);
                });

                it('should resolve again', function() {
                    this.player1.clickCard(this.shiba);
                    expect(this.shiba.militarySkill).toBe(4);
                    expect(this.shiba.politicalSkill).toBe(3);
                });
            });
        });
    });
});

describe('Shiba Tetsu and Spells it does not react to', function() {
    integration(function() {
        describe('a Spell played by the opponent', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tetsu']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['supernatural-storm']
                    }
                });
                this.shiba = this.player1.findCardByName('shiba-tetsu');
                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shiba],
                    defenders: [this.adept]
                });
            });

            it('does not trigger on a Spell played by the opponent', function() {
                this.player2.clickCard('supernatural-storm');
                this.player2.clickCard(this.adept);
                expect(this.adept.militarySkill).toBe(3);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.shiba.militarySkill).toBe(2);
            });
        });

        describe('a Spell played outside a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tetsu', 'adept-of-the-waves'],
                        hand: ['embrace-the-void']
                    }
                });
                this.shiba = this.player1.findCardByName('shiba-tetsu');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.embrace = this.player1.findCardByName('embrace-the-void');
            });

            it('does not trigger on a Spell played outside a conflict', function() {
                expect(this.game.currentConflict).toBeNull();
                this.player1.playAttachment(this.embrace, this.adept);
                expect(this.adept.attachments).toContain(this.embrace);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.shiba.militarySkill).toBe(2);
            });
        });
    });
});
