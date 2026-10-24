describe('Sage of Gisei Toshi', function() {
    integration(function() {
        describe('Sage of Gisei Toshi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['sage-of-gisei-toshi'],
                        honor: 11
                    },
                    player2: {
                        inPlay: ['doji-whisperer','savvy-politician'],
                        honor: 10
                    }
                });
                this.sageOfGiseiToshi = this.player1.findCardByName('sage-of-gisei-toshi');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.savvyPolitician = this.player2.findCardByName('savvy-politician');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.sageOfGiseiToshi);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.sageOfGiseiToshi],
                        defenders: [this.dojiWhisperer]
                    });
                });

                it('should not be able to be triggered if you have equal honor', function() {
                    this.player1.player.honor = 10;
                    this.player2.player.honor = 10;
                    this.player2.pass();
                    expect(this.player1.player.honor).toBe(this.player2.player.honor);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.sageOfGiseiToshi);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not be able to be triggered if you have fewer honor', function() {
                    this.player1.player.honor = 9;
                    this.player2.player.honor = 10;
                    this.player2.pass();
                    expect(this.player1.player.honor).toBeLessThan(this.player2.player.honor);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.sageOfGiseiToshi);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should prompt to select a participating character your opponent controls', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.sageOfGiseiToshi);
                    expect(this.player1).toHavePrompt('Choose a character');
                    expect(this.player1).not.toBeAbleToSelect(this.sageOfGiseiToshi);
                    expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player1).not.toBeAbleToSelect(this.savvyPolitician);
                });

                describe('if it resolves', function() {
                    beforeEach(function() {
                        this.player2.pass();
                        this.player1.clickCard(this.sageOfGiseiToshi);
                        this.player1.clickCard(this.dojiWhisperer);
                    });

                    it('should send itself home', function() {
                        expect(this.sageOfGiseiToshi.inConflict).toBe(false);
                    });

                    it('should send the target home', function() {
                        expect(this.dojiWhisperer.inConflict).toBe(false);
                    });
                });
            });
        });
    });
});

describe('Sage of Gisei Toshi at home', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['sage-of-gisei-toshi', 'doji-challenger'],
                    honor: 11
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    honor: 10
                }
            });
            this.sage = this.player1.findCardByName('sage-of-gisei-toshi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.pass();
        });

        it('cannot be used ("If you do" needs Sage to move home)', function() {
            this.player1.clickCard(this.sage);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.whisperer.isParticipating()).toBe(true);
        });
    });
});
