describe('Righteous Delegate', function() {
    integration(function() {
        describe('Righteous Delegate\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-aramoro', 'soshi-aoi', 'bayushi-manipulator']
                    },
                    player2: {
                        inPlay: ['righteous-delegate', 'shiba-tsukune', 'solemn-scholar', 'shiba-peacemaker']
                    }
                });

                this.righteousDelegate = this.player2.findCardByName('righteous-delegate');
                this.tsukune = this.player2.findCardByName('shiba-tsukune');
                this.solemn = this.player2.findCardByName('solemn-scholar');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');

                this.bayushiAramoro = this.player1.findCardByName('bayushi-aramoro');
                this.soshiAoi = this.player1.findCardByName('soshi-aoi');
                this.manipulator = this.player1.findCardByName('bayushi-manipulator');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    defenders: [this.righteousDelegate, this.tsukune, this.solemn],
                    attackers: [this.bayushiAramoro, this.soshiAoi]
                });
            });

            it('should increase participating non-bushi\'s skill by 1 and decrease participating bushi\'s skill by 1', function () {
                this.player2.clickCard(this.righteousDelegate);

                expect(this.righteousDelegate.militarySkill).toBe(3);
                expect(this.righteousDelegate.politicalSkill).toBe(4);

                expect(this.tsukune.militarySkill).toBe(3);
                expect(this.tsukune.politicalSkill).toBe(3);

                expect(this.solemn.militarySkill).toBe(2);
                expect(this.solemn.politicalSkill).toBe(2);

                expect(this.bayushiAramoro.militarySkill).toBe(4);
                expect(this.bayushiAramoro.politicalSkill).toBe(1);

                expect(this.soshiAoi.militarySkill).toBe(3);
                expect(this.soshiAoi.politicalSkill).toBe(4);
            });

            it('should not modify non-participating character\'s skills', function () {
                this.player2.clickCard(this.righteousDelegate);

                expect(this.peacemaker.militarySkill).toBe(4);
                expect(this.peacemaker.politicalSkill).toBe(1);

                expect(this.manipulator.militarySkill).toBe(1);
                expect(this.manipulator.politicalSkill).toBe(1);
            });
        });
    });
});

