describe('Isawa Uona', function () {
    integration(function () {
        describe('Isawa Uona\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'moto-juro'],
                        hand: [],
                        dynastyDeck: ['keeper-initiate']
                    },
                    player2: {
                        fate: 5,
                        inPlay: ['isawa-uona', 'shiba-peacemaker'],
                        hand: ['cloud-the-mind'],
                        conflictDeck: ['fine-katana', 'watch-commander', 'favored-mount']
                    }
                });
                this.uona = this.player2.findCardByName('Isawa Uona', 'play area');
                this.outrider = this.player1.findCardByName('Shinjo Outrider', 'play area');
                this.juro = this.player1.findCardByName('Moto Juro', 'play area');
            });

            it('should not trigger in a pre-conflict window', function () {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('cloud-the-mind');
                this.player2.clickCard(this.outrider);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            describe('during a conflict', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'air',
                        defenders: ['shiba-peacemaker'],
                        attackers: ['shinjo-outrider', 'moto-juro']
                    });
                    this.player2.clickCard('cloud-the-mind');
                    this.player2.clickCard(this.outrider);
                });

                it('should trigger after playing an air card', function () {
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect('isawa-uona');
                });

                describe('When the reaction is triggered', function () {
                    beforeEach(function () {
                        this.player2.clickCard(this.uona);
                    });

                    it('should allow selecting a non-unique character', function () {
                        expect(this.player2).toHavePrompt('Choose a character');
                        expect(this.player2).toBeAbleToSelect(this.outrider);
                    });

                    it('should not allow selecting a unique character', function () {
                        expect(this.player2).not.toBeAbleToSelect(this.juro);
                    });

                    describe('if a legal character is selected', function () {
                        beforeEach(function () {
                            this.player2.clickCard(this.outrider);
                        });

                        it('should bow that character', function () {
                            expect(this.outrider.bowed).toBe(true);
                        });
                    });
                });
            });
        });
    });
});

describe('Isawa Uona rulings', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-outrider'],
                    hand: ['voice-of-honor']
                },
                player2: {
                    fate: 5,
                    inPlay: ['isawa-uona', 'shiba-peacemaker', 'kitsu-spiritcaller'],
                    hand: ['trick-of-the-light'],
                    dynastyDiscard: ['asahina-artisan']
                }
            });
            this.uona = this.player2.findCardByName('isawa-uona');
            this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            this.spiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
            this.artisan = this.player2.findCardByName('asahina-artisan');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: [this.peacemaker]
            });
        });

        it('triggers when the Air event is cancelled (#411)', function () {
            this.outrider.honor();
            this.player2.clickCard('trick-of-the-light');
            this.player2.clickCard(this.peacemaker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard('voice-of-honor');
            expect(this.getChatLogs(5)).toContain('player1 plays Voice of Honor to cancel the effects of Trick of the Light');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.uona);
            this.player2.clickCard(this.uona);
            this.player2.clickCard(this.outrider);
            expect(this.outrider.bowed).toBe(true);
        });

        it('does not trigger when an Air card is put into play (#754)', function () {
            this.player2.clickCard(this.spiritcaller);
            this.player2.clickCard(this.artisan);
            expect(this.artisan.isParticipating()).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
